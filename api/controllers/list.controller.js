// server/controllers/list.controller.js
// backend/controllers/listController.js
import mongoose from "mongoose";
import Board from "../models/board.model.js";
import List from "../models/list.model.js";
import Card from "../models/card.model.js";
import Activity from "../models/activity.model.js";
import { pushNotification } from "../utils/pushNotification.js";


// Helper: check if user belongs to board

export const checkBoardMembership = async (boardId, userId) => {
  const board = await Board.findById(boardId);
  if (!board) return { authorized: false, message: "Board not found" };

  const isMember = board.members.some((member) => member.equals(userId));
  if (!isMember) return { authorized: false, message: "Not authorized" };

  return { authorized: true, board };
};

// -------------------- LIST ACTIONS --------------------

// Create a new list
export const createList = async (req, res) => {
  const { boardId } = req.params;
  const { title } = req.body;
  const userId = req.user?.id;

  try {
    const { authorized, message, board } = await checkBoardMembership(boardId, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const existingLists = await List.find({ board: boardId }).sort({ order: 1 });
    const newOrder = existingLists.length > 0 ? existingLists[existingLists.length - 1].order + 1 : 0;

    const list = await List.create({ title, board: boardId, order: newOrder });
    board.lists.push(list._id);

    // Activity log
    await Activity.create({
      user: userId,
      action: "list_created",
      board: boardId,
      entity: "list",
      entityId: list._id,
      details: { title: list.title }
    });

    // Push notification to board members except actor
    const recipientIds = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipientIds,
      type: "list_created",
      title: `New list: ${list.title}`,
      message: `A new list was created in board '${board.title}'`,
      referenceId: list._id,
      url: `/boards/${boardId}`
    });

    await board.save();
    res.status(201).json({ ...list.toObject(), cards: [] });

  } catch (err) {
    console.error("Error creating list:", err);
    res.status(500).json({ message: "Server error while creating list" });
  }
};

// Get lists for a board
export const getListsByBoardId = async (req, res) => {
  const { boardId } = req.params;
  const userId = req.user?.id;

  try {
    const { authorized, message } = await checkBoardMembership(boardId, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const lists = await List.find({ board: boardId })
      .populate({
        path: "cards",
        populate: { path: "members labels", select: "name email title color" },
        options: { sort: { order: 1 } }
      })
      .sort({ order: 1 });

    res.json(lists);

  } catch (err) {
    console.error("Error fetching lists:", err);
    res.status(500).json({ message: "Server error while fetching lists" });
  }
};

// Update list (title)
export const updateList = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const userId = req.user?.id;

  try {
    const list = await List.findById(id);
    if (!list) return res.status(404).json({ message: "List not found" });

    const { authorized, message, board } = await checkBoardMembership(list.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const oldTitle = list.title;
    if (title) list.title = title;
    const updatedList = await list.save();

    // Activity log
    await Activity.create({
      user: userId,
      action: "list_updated",
      board: board._id,
      entity: "list",
      entityId: list._id,
      details: { oldTitle, newTitle: title }
    });

    // Push notification to other board members
    const recipientIds = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipientIds,
      type: "list_updated",
      title: `List updated: ${title}`,
      message: `List '${oldTitle}' was renamed to '${title}'`,
      referenceId: list._id,
      url: `/boards/${board._id}`
    });

    res.json(updatedList);

  } catch (err) {
    console.error("Error updating list:", err);
    res.status(500).json({ message: "Server error while updating list" });
  }
};

// Delete list (cascade cards)
export const deleteList = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const list = await List.findById(id);
    if (!list) return res.status(404).json({ message: "List not found" });

    const { authorized, message, board } = await checkBoardMembership(list.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    // Delete associated cards
    await Card.deleteMany({ list: id });
    // Remove list from board
    board.lists = board.lists.filter((l) => !l.equals(id));
    await board.save();
    await List.deleteOne({ _id: id });

    // Activity log
    await Activity.create({
      user: userId,
      action: "list_deleted",
      board: board._id,
      entity: "list",
      entityId: id,
      details: { title: list.title }
    });

    // Push notification
    const recipientIds = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipientIds,
      type: "list_deleted",
      title: `List deleted: ${list.title}`,
      message: `List '${list.title}' was deleted from board '${board.title}'`,
      referenceId: id,
      url: `/boards/${board._id}`
    });

    res.json({ message: "List and its cards removed successfully" });

  } catch (err) {
    console.error("Error deleting list:", err);
    res.status(500).json({ message: "Server error while deleting list" });
  }
};

// Reorder lists
export const reorderLists = async (req, res) => {
  const { boardId } = req.params;
  const { listIdsInOrder } = req.body;
  const userId = req.user?.id;

  try {
    const { authorized, message, board } = await checkBoardMembership(boardId, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    if (!Array.isArray(listIdsInOrder) || listIdsInOrder.length === 0) {
      return res.status(400).json({ message: "Invalid list order" });
    }

    const bulkOps = listIdsInOrder.map((listId, index) => ({
      updateOne: { filter: { _id: listId, board: boardId }, update: { $set: { order: index } } }
    }));
    await List.bulkWrite(bulkOps);
    await Board.findByIdAndUpdate(boardId, { $set: { lists: listIdsInOrder } });

    // Activity log
    await Activity.create({
      user: userId,
      action: "lists_reordered",
      board: board._id,
      entity: "list",
      details: { order: listIdsInOrder }
    });

    res.json({ message: "Lists reordered successfully" });

  } catch (err) {
    console.error("Error reordering lists:", err);
    res.status(500).json({ message: "Server error while reordering lists" });
  }
};

// Update card order within a list
export const updateCardOrder = async (req, res) => {
  const { listId } = req.params;
  const { newCardOrder } = req.body;
  const userId = req.user?.id;

  try {
    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ message: "List not found" });

    list.cards = newCardOrder;
    const updatedList = await list.save();

    // Activity log
    await Activity.create({
      user: userId,
      action: "cards_reordered",
      board: list.board,
      entity: "list",
      entityId: list._id,
      details: { order: newCardOrder }
    });

    res.status(200).json(updatedList);

  } catch (err) {
    console.error("Error updating card order:", err);
    res.status(500).json({ message: "Server error while updating card order" });
  }
};

// -------------------- TIMELINE / HISTORY QUERY --------------------

// Get activity for a board, optional list or card filter
/*
export const getActivity = async (req, res) => {
  const { boardId } = req.params;
  const { listId, cardId } = req.query; // optional filters
  const userId = req.userId;

  try {
    const { authorized, message } = await checkBoardMembership(boardId, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const filter = { board: boardId };
    if (listId) filter.listId = listId;
    if (cardId) filter.cardId = cardId;

    const activities = await Activity.find(filter)
      .populate("user", "name email")
      .sort({ timestamp: -1 });

    res.json(activities);

  } catch (err) {
    console.error("Error fetching activity:", err);
    res.status(500).json({ message: "Server error while fetching activity" });
  }
};
*/



// Delete list with full cascade and activity/logging
export const deleteDeleteList = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const list = await List.findById(id);
    if (!list) return res.status(404).json({ message: "List not found" });

    const { authorized, message, board } = await checkBoardMembership(list.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    // Cascade delete cards
    await Card.deleteMany({ list: id });

    // Remove list from board
    board.lists = board.lists.filter((l) => !l.equals(id));
    await board.save();

    // Delete list
    await List.findByIdAndDelete(id);

    // Activity log
    await Activity.create({
      user: userId,
      action: "list_deleted",
      board: board._id,
      entity: "list",
      entityId: id,
      details: { title: list.title }
    });

    // Push notifications to other members
    const recipients = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipients,
      type: "list_deleted",
      title: `List deleted: ${list.title}`,
      message: `List '${list.title}' was deleted from board '${board.title}'`,
      referenceId: id,
      url: `/boards/${board._id}`
    });

    res.status(200).json({ message: "List and its cards deleted successfully" });

  } catch (err) {
    console.error("Error deleting list:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update list order
export const updateListOrder = async (req, res) => {
  const { boardId } = req.params;
  const { orderedIds } = req.body;
  const userId = req.user?.id;

  try {
    const { authorized, message, board } = await checkBoardMembership(boardId, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    await Promise.all(
      orderedIds.map((id, index) => List.findByIdAndUpdate(id, { order: index }))
    );
    await Board.findByIdAndUpdate(boardId, { lists: orderedIds });

    // Activity log
    await Activity.create({
      user: userId,
      action: "lists_reordered",
      board: board._id,
      entity: "list",
      details: { order: orderedIds }
    });

    // Push notifications
    const recipients = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipients,
      type: "lists_reordered",
      title: "Lists reordered",
      message: `The order of lists was updated in board '${board.title}'`,
      referenceId: board._id,
      url: `/boards/${board._id}`
    });

    res.status(200).json({ message: "List order updated successfully" });

  } catch (err) {
    console.error("Error updating list order:", err);
    res.status(500).json({ message: err.message });
  }
};




