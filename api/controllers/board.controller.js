// server/controllers/board.controller.js
import Board from '../models/board.model.js'; // Import the Board model
import List from '../models/list.model.js';
import Card from '../models/card.model.js';
import Activity from '../models/activity.model.js'; 
import User from '../models/user.model.js';   // Import the User model (for member management)
import mongoose from "mongoose";
import { pushNotification } from '../utils/pushNotification.js';


/**
 * @desc    Create a new board
 * @route   POST /api/boards
 * @access  Private
 */
export const createBoard = async (req, res) => {
  const { name, description, background, memberIds = [] } = req.body;
  const ownerId = req.user?.id;

  try {
    const uniqueMemberIds = Array.from(new Set([ownerId, ...memberIds]));

    const board = new Board({
      name,
      description,
      background,
      owner: ownerId,
      members: uniqueMemberIds
    });

    const savedBoard = await board.save();

    // Add board to users' boards list
    await User.updateMany(
      { _id: { $in: uniqueMemberIds } },
      { $addToSet: { boards: savedBoard._id } }
    );

    // Activity log
    const activity = new Activity({
      user: ownerId,
      action: 'created',
      board: savedBoard._id,
      details: `Board "${name}" created`
    });
    await activity.save();

    savedBoard.activity.push(activity);
    await savedBoard.save();

    // Push notification
    await pushNotification({
      actor: ownerId,
      userIds: uniqueMemberIds,
      type: 'board_created',
      title: 'Board Created',
      message: `📝 Board "${name}" has been created.`,
      referenceId: savedBoard._id,
      url: `/boards/${savedBoard._id}`
    });

    res.status(201).json(savedBoard);
  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({ message: 'Server error while creating board' });
  }
};

/**
 * @desc    Get all boards for the authenticated user
 * @route   GET /api/boards
 * @access  Private
 */
export const getBoards = async (req, res) => {
  const userId = req.user?.id;

  try {
    const boards = await Board.find({
      $or: [{ owner: userId }, { members: userId }]
    })
    .populate('owner', 'username email')
    .populate('members', 'username email')
    .populate('lists', 'title order')
    .populate({
      path: 'activity',
      populate: { path: 'user', model: 'User', select: 'username email' }
    })
    .sort({ createdAt: -1 });

    res.json(boards);
  } catch (error) {
    console.error('Error fetching boards:', error);
    res.status(500).json({ message: 'Server error while fetching boards' });
  }
};

/**
 * @desc    Get a single board by ID
 * @route   GET /api/boards/:id
 * @access  Private
 */
export const getBoardById = async (req, res) => {
  const { id: boardId } = req.params;
  const userId = req.user?.id;

  try {
    const board = await Board.findById(boardId)
      .populate('owner', 'username email')
      .populate('members', 'username email')
      .populate({
        path: 'lists',
        populate: {
          path: 'cards',
          model: 'Card',
          populate: { path: 'members', model: 'User', select: 'username email' }
        },
        options: { sort: { order: 1 } }
      })
      .populate({
        path: 'activity',
        populate: { path: 'user', model: 'User', select: 'username email' }
      });

    if (!board) return res.status(404).json({ message: 'Board not found' });

    const isMember = board.members.some(m => m._id.equals(userId)) || board.owner._id.equals(userId);
    if (!isMember) return res.status(403).json({ message: 'Not authorized to access this board' });

    res.json(board);
  } catch (error) {
    console.error('Error fetching board by ID:', error);
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid board ID' });
    res.status(500).json({ message: 'Server error while fetching board' });
  }
};


// @desc Get lists for a board
// @route GET /api/boards/:id/lists
// @access Private
export const getListsForBoard = async (req, res) => {
  const boardId = req.params.id;
  const userId = req.user?.id;

  try {
    const board = await Board.findById(boardId).populate('lists');

    if (!board) return res.status(404).json({ message: 'Board not found' });

    const isMember = board.members.includes(userId) || board.owner.equals(userId);
    if (!isMember) return res.status(403).json({ message: 'Not authorized' });

    res.json(board.lists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching lists' });
  }
};


/**
 * @desc    Update a board
 * @route   PUT /api/boards/:id
 * @access  Private
 */
export const updateBoard = async (req, res) => {
  const { id: boardId } = req.params;
  const userId = req.user?.id;
  const { name, description, background } = req.body;

  try {
    const board = await Board.findById(boardId).populate('owner members', 'username email');
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const isOwner = board.owner._id.equals(userId);
    const isMember = board.members.some(m => m._id.equals(userId));
    if (!isOwner && !isMember) return res.status(403).json({ message: 'Not authorized to update this board' });

    let changes = [];
    if (name && name !== board.name) { changes.push(`renamed board to "${name}"`); board.name = name; }
    if (description && description !== board.description) { changes.push('updated description'); board.description = description; }
    if (background && background !== board.background) { changes.push('changed background'); board.background = background; }

    const updatedBoard = await board.save();

    if (changes.length > 0) {
      const activity = new Activity({
        user: userId,
        action: 'updated',
        board: board._id,
        details: changes.join(", ")
      });
      await activity.save();

      board.activity.push(activity);
      await board.save();

      await pushNotification({
        actor: userId,
        userIds: board.members.map(m => m._id),
        type: 'board_updated',
        title: 'Board Updated',
        message: `✏️ Board "${board.name}" updated: ${changes.join(', ')}`,
        referenceId: board._id,
        url: `/boards/${board._id}`
      });
    }

    res.json(updatedBoard);
  } catch (error) {
    console.error('Error updating board:', error);
    res.status(500).json({ message: 'Server error while updating board' });
  }
};

/**
 * @desc    Delete a board
 * @route   DELETE /api/boards/:id
 * @access  Private
 */
export const deleteBoard = async (req, res) => {
  const { id: boardId } = req.params;
  const userId = req.user?.id;

  try {
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    if (!board.owner.equals(userId)) return res.status(403).json({ message: 'Only the owner can delete this board' });

    // Cascade delete lists & cards
    await Card.deleteMany({ board: boardId });
    await List.deleteMany({ board: boardId });
    await Board.deleteOne({ _id: boardId });

    // Remove board from all users
    await User.updateMany({ boards: boardId }, { $pull: { boards: boardId } });

    await pushNotification({
      actor: userId,
      userIds: board.members,
      type: 'board_deleted',
      title: 'Board Deleted',
      message: `❌ Board "${board.name}" has been deleted.`,
      referenceId: board._id
    });

    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Error deleting board:', error);
    res.status(500).json({ message: 'Server error while deleting board' });
  }
};


/**
 * @desc    Add a member to board
 * @route   PUT /api/boards/:id/members
 * @access  Private
 */
export const addBoardMember = async (req, res) => {
  const { id: boardId } = req.params;
  const { email } = req.body;
  const userId = req.user?.id;

  try {
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const isOwner = board.owner.equals(userId);
    const isMember = board.members.includes(userId);
    if (!isOwner && !isMember) return res.status(403).json({ message: 'Not authorized to add members' });

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) return res.status(404).json({ message: 'User not found' });
    if (board.members.includes(userToAdd._id)) return res.status(400).json({ message: 'User already a member' });

    board.members.push(userToAdd._id);
    await board.save();
    await User.findByIdAndUpdate(userToAdd._id, { $addToSet: { boards: boardId } });

    const activity = new Activity({
      user: userId,
      action: 'added',
      board: board._id,
      details: `added ${userToAdd.username || userToAdd.email} to the board`
    });
    await activity.save();
    board.activity.push(activity);
    await board.save();

    await pushNotification({
      actor: userId,
      userIds: [userToAdd._id, ...board.members.filter(m => !m.equals(userToAdd._id))],
      type: 'member_added',
      title: 'New Board Member',
      message: `👥 ${userToAdd.username || userToAdd.email} added to board "${board.name}"`,
      referenceId: board._id
    });

    const populatedBoard = await Board.findById(boardId).populate("members", "username email");
    res.json(populatedBoard.members);
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ message: 'Server error while adding member' });
  }
};

/**
 * @desc    Remove a member
 * @route   DELETE /api/boards/:id/members/:memberId
 * @access  Private
 */
export const removeBoardMember = async (req, res) => {
  const { id: boardId, memberId } = req.params;
  const userId = req.user?.id;

  try {
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const isOwner = board.owner.equals(userId);
    const isSelf = userId === memberId;
    if (!isOwner && !isSelf) return res.status(403).json({ message: 'Not authorized to remove this member' });

    if (board.owner.equals(memberId)) return res.status(400).json({ message: 'Owner cannot be removed. Delete board instead.' });

    const removedUser = await User.findById(memberId);
    board.members = board.members.filter(m => !m.equals(memberId));
    await board.save();
    await User.findByIdAndUpdate(memberId, { $pull: { boards: boardId } });

    const activity = new Activity({
      user: userId,
      action: 'removed',
      board: board._id,
      details: `removed ${removedUser?.username || removedUser?.email} from the board`
    });
    await activity.save();
    board.activity.push(activity);
    await board.save();

    await pushNotification({
      actor: userId,
      userIds: board.members,
      type: 'member_removed',
      title: 'Board Member Removed',
      message: `🚫 ${removedUser.username || removedUser.email} removed from board "${board.name}"`,
      referenceId: board._id
    });

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ message: 'Server error while removing member' });
  }
};



// Get Board by ID
export const getBoardByTheId = async (req, res) => {
  const boardId = req.params.id;
    const userId = req.user?.id;
  try {
    const board = await Board.findById(req.params.id)
      .populate({
        path: 'lists',
        populate: {
          path: 'cards',
          populate: 'labels'
        }
      });

    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.status(200).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * @desc    Create a list in a board
 * @route   POST /api/boards/:id/lists
 * @access  Private
 */
export const createListForBoard = async (req, res) => {
  const boardId = req.params.id;
  const { title } = req.body;
  const userId = req.user?.id;

  try {
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const isOwner = board.owner.equals(userId);
    const isMember = board.members.includes(userId);
    if (!isOwner && !isMember) return res.status(403).json({ message: 'Not authorized to add lists to this board' });

    const order = board.lists.length;

    const newList = new List({ title, board: boardId, order, cards: [] });
    const savedList = await newList.save();

    board.lists.push(savedList._id);
    await board.save();

    const activity = new Activity({
      user: userId,
      action: 'created_list',
      board: board._id,
      details: `Created list "${title}" in board "${board.name}"`
    });
    await activity.save();
    board.activity.push(activity);
    await board.save();

    await pushNotification({
      actor: userId,
      userIds: board.members,
      type: 'list_created',
      title: 'New List Added',
      message: `🗂️ List "${title}" added to board "${board.name}"`,
      referenceId: board._id
    });

    res.status(201).json(savedList);
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).json({ message: 'Server error creating list' });
  }
};


/**
 * @desc    Create a new list in a board
 * @route   POST /api/boards/:boardId/lists
 * @access  Private
 */
export const createList = async (req, res) => {
  const { boardId } = req.params;
  const { title } = req.body;
  const userId = req.user?.id;

  try {
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const isOwner = board.owner.equals(userId);
    const isMember = board.members.some((m) => m.equals(userId));
    if (!isOwner && !isMember)
      return res.status(403).json({ message: 'Not authorized to add lists to this board' });

    const order = board.lists.length;

    const newList = new List({
      title,
      board: board._id,
      cards: [],
      order
    });

    const savedList = await newList.save();

    // Push new list to board's lists
    board.lists.push(savedList._id);
    await board.save();

    // Activity log
    const activity = new Activity({
      user: userId,
      action: 'created_list',
      board: board._id,
      details: `Created list "${title}" in board "${board.name}"`
    });
    await activity.save();

    board.activity.push(activity);
    await board.save();

    // Push notifications
    const memberIds = board.members.map((m) => m.toString()).filter((id) => id !== userId);
    await pushNotification({
      actor: userId,
      userIds: memberIds,
      type: 'list_created',
      title: 'New List Added',
      message: `🗂️ List "${title}" was added to board "${board.name}"`,
      referenceId: board._id,
      url: `/boards/${board._id}`
    });

    res.status(201).json(savedList);
  } catch (err) {
    console.error('Error creating list:', err);
    res.status(500).json({ message: 'Server error while creating list' });
  }
};


/**
 * @desc    Update list order in board
 * @route   PUT /api/boards/:boardId/lists/reorder
 * @access  Private
 */
export const updateListOrder = async (req, res) => {
  const { boardId } = req.params;
  const { newListOrder } = req.body;
  const actorId = req.user?.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(boardId)) return res.status(400).json({ message: "Invalid board ID" });

    const board = await Board.findById(boardId).populate("members", "_id");
    if (!board) return res.status(404).json({ message: "Board not found" });

    // Validate list IDs
    const validListIds = await List.find({ _id: { $in: newListOrder } });
    if (validListIds.length !== newListOrder.length) return res.status(400).json({ message: "Invalid list IDs" });

    board.lists = newListOrder.map(id => new mongoose.Types.ObjectId(id));
    await board.save();

    const updatedBoard = await board.populate({
      path: "lists",
      populate: { path: "cards" },
      options: { sort: { order: 1 } }
    });

    // Activity log
    const activity = new Activity({
      user: actorId,
      action: 'reordered_lists',
      board: board._id,
      details: `Updated list order on board "${board.name}"`
    });
    await activity.save();
    board.activity.push(activity);
    await board.save();

    // Notifications
    const memberIds = board.members.map(m => m._id.toString()).filter(id => id !== actorId);
    if (memberIds.length > 0) {
      await pushNotification({
        actor: actorId,
        userIds: memberIds,
        type: "list_order_updated",
        title: "List Order Updated",
        message: `📋 The list order in board "${board.name}" was updated.`,
        referenceId: board._id,
        url: `/boards/${board._id}`,
      });
    }

    res.status(200).json(updatedBoard);
  } catch (error) {
    console.error("Error updating list order:", error);
    res.status(500).json({ message: "Server error while updating list order" });
  }
};




export const getListsByBoardId = async (req, res) => {
    const { boardId } = req.params;
    const userId = req.user?.id;
  try {
    const board = await Board.findOne({ _id: boardId, owner: userId });
    if (!board) {
    return res.status(403).json({ message: "Access denied to this board" });
    }

    // const lists = await List.find({ board: req.params.boardId }).populate("cards");
    // Find all lists belonging to the board and populate their cards
    const lists = await List.find({ board: boardId })
        .populate({
            path: 'cards',
            model: 'Card',
           /* populate: {
                path: 'members', // Populate members on cards
                model: 'User',
                select: 'name email'
            }, */
            options: { sort: { 'order': 1 } } // Sort cards by order
        })
        .sort({ order: 1 }); // Sort lists by their order field
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * @desc    Update board members (full list)
 * @route   PUT /api/boards/:id/members
 * @access  Private
 */
export const updateBoardMembers = async (req, res) => {
  const { id: boardId } = req.params;
  const { memberIds } = req.body; // full list of member IDs to keep
  const userId = req.user?.id;

  try {
    const board = await Board.findById(boardId).populate('members', 'username email');
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const isOwner = board.owner.equals(userId);
    const isMember = board.members.some((m) => m._id.equals(userId));
    if (!isOwner && !isMember)
      return res.status(403).json({ message: 'Not authorized to update members' });

    // Ensure owner always included
    const finalMembers = Array.from(new Set([board.owner.toString(), ...memberIds]));

    // Find added & removed members
    const prevIds = board.members.map((m) => m._id.toString());
    const added = finalMembers.filter((id) => !prevIds.includes(id));
    const removed = prevIds.filter((id) => !finalMembers.includes(id));

    // Update board members
    board.members = finalMembers.map((id) => mongoose.Types.ObjectId(id));
    await board.save();

    // Sync User.boards
    if (added.length > 0) {
      await User.updateMany({ _id: { $in: added } }, { $addToSet: { boards: boardId } });
    }
    if (removed.length > 0) {
      await User.updateMany({ _id: { $in: removed } }, { $pull: { boards: boardId } });
    }

    // Activity log
    const activity = new Activity({
      user: userId,
      action: 'updated_members',
      board: board._id,
      details: `Updated members on board "${board.name}". Added: [${added.join(
        ', '
      )}], Removed: [${removed.join(', ')}]`
    });
    await activity.save();

    board.activity.push(activity);
    await board.save();

    // Notifications
    const notifyIds = finalMembers.filter((id) => id !== userId);
    if (notifyIds.length > 0) {
      await pushNotification({
        actor: userId,
        userIds: notifyIds,
        type: 'board_members_updated',
        title: 'Board Members Updated',
        message: `👥 Members updated on board "${board.name}"`,
        referenceId: board._id,
        url: `/boards/${board._id}`
      });
    }

    const populatedBoard = await Board.findById(boardId).populate('members', 'username email');
    res.json(populatedBoard.members);
  } catch (err) {
    console.error('Error updating board members:', err);
    res.status(500).json({ message: 'Server error while updating members' });
  }
};


