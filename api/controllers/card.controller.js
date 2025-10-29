// server/controllers/card.controller.js
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

import Card from "../models/card.model.js";
import List from "../models/list.model.js";
import Board from "../models/board.model.js";
// import Label from "../models/label.model.js";
import Activity from "../models/activity.model.js";
import User from "../models/user.model.js";
import { pushNotification } from "../utils/pushNotification.js";
// import cloudinary from "cloudinary";
import { v2 as cloudinary } from 'cloudinary';



// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get upload directory from .env or default
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'public/uploads';

// Helper function to check if user is a member of the board
// Helper: Check board membership
const checkBoardMembership = async (boardId, userId) => {
  const board = await Board.findById(boardId);
  if (!board) return { authorized: false, message: "Board not found" };
  const isMember = board.members.some(m => m.equals(userId));
  if (!isMember) return { authorized: false, message: "Not authorized to access this board" };
  return { authorized: true, board };
};


// not pasted 

// -------------------- Create Card --------------------
// -------------------- CREATE CARD --------------------
export const createCard = async (req, res) => {
  try {
    const { listId } = req.params;
    const { title, description, dueDate, labels = [], members = [] } = req.body;
    const userId = req.user.id;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ message: "List not found" });

    const { authorized, message, board } = await checkBoardMembership(list.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const existingCards = await Card.find({ list: listId }).sort({ order: 1 });
    const newOrder = existingCards.length > 0 ? existingCards[existingCards.length - 1].order + 1 : 0;

    const card = await Card.create({
      title,
      description,
      dueDate,
      labels,
      members,
      list: listId,
      board: board._id,
      owner: userId,
      order: newOrder
    });

    list.cards.push(card._id);
    await list.save();

    await Activity.create({
      user: userId,
      action: "card_created",
      board: board._id,
      entity: "card",
      entityId: card._id,
      listId,
      cardId: card._id,
      details: { title }
    });

    const recipients = board.members.filter(m => !m.equals(userId));
    if (recipients.length > 0) {
      await pushNotification({
        actor: userId,
        userIds: recipients,
        type: "card_created",
        title: `New card: ${title}`,
        message: `Card '${title}' added to list '${list.name}'`,
        referenceId: card._id,
        url: `/boards/${board._id}`
      });
    }

    const populated = await Card.findById(card._id).populate("members", "username email");
    res.status(201).json(populated);
  } catch (err) {
    console.error("[Create Card Error]", err);
    res.status(500).json({ message: err.message });
  }
};



// -------------------- Update Card --------------------
// -------------------- UPDATE CARD --------------------
export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;

    const card = await Card.findById(id).populate("members", "username email");
    if (!card) return res.status(404).json({ message: "Card not found" });

    const { authorized, message, board } = await checkBoardMembership(card.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const changes = [];
    for (const key of Object.keys(updates)) {
      if (updates[key] !== undefined && card[key] !== updates[key]) {
        changes.push({ field: key, oldValue: card[key], newValue: updates[key] });
        card[key] = updates[key];
      }
    }

    await card.save();

    for (const change of changes) {
      await Activity.create({
        user: userId,
        action: "card_updated",
        board: board._id,
        entity: "card",
        entityId: card._id,
        details: `${change.field} changed from '${change.oldValue}' to '${change.newValue}'`
      });
    }

    const recipients = card.members.filter(m => !m._id.equals(userId)).map(m => m._id);
    if (recipients.length > 0 && changes.length > 0) {
      await pushNotification({
        actor: userId,
        userIds: recipients,
        type: "card_updated",
        title: `Card updated: ${card.title}`,
        message: changes.map(c => `${c.field}: ${c.oldValue} → ${c.newValue}`).join(", "),
        referenceId: card._id,
        url: `/boards/${board._id}/cards/${card._id}`
      });
    }

    const populated = await Card.findById(card._id)
      .populate("members", "username email")
      .populate("comments.user", "username email")
      .populate("attachments.uploadedBy", "username email");

    res.json(populated);
  } catch (err) {
    console.error("[Update Card Error]", err);
    res.status(500).json({ message: err.message });
  }
};

// -------------------- Delete Card --------------------
// -------------------- DELETE CARD --------------------
export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const card = await Card.findById(id).populate("members", "username email");
    if (!card) return res.status(404).json({ message: "Card not found" });

    const { authorized, message, board } = await checkBoardMembership(card.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    if (card.attachments?.length > 0) {
      card.attachments.forEach(att => {
        const filePath = path.join("public/uploads", path.basename(att.url));
        fs.unlink(filePath, err => err && console.error(err));
      });
    }

    const list = await List.findById(card.list);
    if (list) {
      list.cards.pull(card._id);
      await list.save();
    }

    await Card.deleteOne({ _id: id });

    await Activity.create({
      user: userId,
      action: "card_deleted",
      board: board._id,
      entity: "card",
      entityId: card._id,
      listId: card.list,
      cardId: card._id,
      details: { title: card.title }
    });

    const recipients = card.members.filter(m => !m._id.equals(userId)).map(m => m._id);
    if (recipients.length > 0) {
      await pushNotification({
        actor: userId,
        userIds: recipients,
        type: "card_deleted",
        title: `Card deleted: ${card.title}`,
        message: `Card '${card.title}' was deleted`,
        referenceId: card._id,
        url: `/boards/${board._id}`
      });
    }

    res.json({ message: "Card deleted successfully" });
  } catch (err) {
    console.error("[Delete Card Error]", err);
    res.status(500).json({ message: err.message });
  }
};

// not pasted 
// not pasted 

export const moveCardController = async (req, res) => {

  try {
    const { cardId } = req.params;
    const { targetCardId, targetListId } = req.body;

    if (!cardId) return res.status(400).json({ message: "cardId is required" });

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const sourceListId = card.list.toString();
    const newListId = targetListId || sourceListId;
    const movingToNewList = newListId !== sourceListId;

    const sourceList = await List.findById(sourceListId);
    const targetList = await List.findById(newListId);
    if (!sourceList || !targetList) return res.status(404).json({ message: "List not found" });

    const board = await Board.findById(card.board);
    if (!board) return res.status(404).json({ message: "Board not found" });

    // Remove card from source list
    const sourceIndex = sourceList.cards.indexOf(card._id);
    if (sourceIndex !== -1) sourceList.cards.splice(sourceIndex, 1);

    // Insert card into target list
    let cardsInList = await Card.find({ list: newListId, _id: { $ne: cardId } }).sort({ order: 1 });
    if (targetCardId) {
      const idx = cardsInList.findIndex(c => c._id.toString() === targetCardId);
      if (idx === -1) return res.status(404).json({ message: "Target card not found" });
      cardsInList.splice(idx + 1, 0, card);
    } else {
      cardsInList.push(card);
    }

    // Update order and save
    for (let i = 0; i < cardsInList.length; i++) {
      cardsInList[i].order = i;
      await cardsInList[i].save();
    }

    // Update target/source lists
    targetList.cards = cardsInList.map(c => c._id);
    await Promise.all([sourceList.save(), targetList.save()]);

    // Update card list reference if moved
    if (movingToNewList) {
      card.list = newListId;
      await card.save();
    }

    // Activity log
    await Activity.create({
      user: req.user?.id,
      action: "card_moved",
      board: board._id,
      entity: "card",
      entityId: card._id,
      details: `Card '${card.title}' moved from '${sourceList.name}' to '${targetList.name}'`
    });

    // Push notifications to all board members except actor
    const memberIds = board.members.filter(m => m.toString() !== req.user.id);
    if (memberIds.length > 0) {
      await pushNotification({
        actor: req.user?.id,
        userIds: memberIds,
        type: "card_moved",
        title: `Card moved: ${card.title}`,
        message: `Card '${card.title}' moved from '${sourceList.name}' to '${targetList.name}'`,
        referenceId: card._id,
        url: `/boards/${board._id}`
      });
    }

    res.status(200).json({ message: "Card moved successfully", card });
  } catch (err) {
    console.error("[Move Card Controller Error]", err);
    res.status(500).json({ message: err.message });
  }
};




export const addCommentToCard = async (req, res) => {
  const { id } = req.params; // Card ID
  const { text } = req.body;
  const userId = req.user?.id;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    const card = await Card.findById(id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const { authorized, message, board } = await checkBoardMembership(card.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const newComment = { user: userId, text, createdAt: new Date() };
    card.comments.push(newComment);
    const updatedCard = await card.save();

    const populatedComment = updatedCard.comments[updatedCard.comments.length - 1];
    await User.populate(populatedComment, { path: "user", select: "username email" });

    // Activity
    await Activity.create({
      user: userId,
      action: "comment_added",
      board: board._id,
      listId: card.list,
      cardId: card._id,
      entity: "card",
      entityId: card._id,
      details: { text }
    });

    // Push notification
    const recipients = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipients,
      type: "comment_added",
      title: `New comment on card: ${card.title}`,
      message: `A new comment was added in board '${board.title}'`,
      referenceId: card._id,
      url: `/boards/${board._id}`
    });

    res.status(201).json(populatedComment);

  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error while adding comment" });
  }
};

export const deleteCommentFromCard = async (req, res) => {
  const { cardId, commentId } = req.params;
  const userId = req.user?.id;

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const { authorized, message, board } = await checkBoardMembership(card.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const comment = card.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isOwner = comment.user.equals(userId);
    const isBoardOwner = board.owner.equals(userId);
    if (!isOwner && !isBoardOwner) return res.status(403).json({ message: "Not authorized" });

    comment.remove();
    await card.save();

    // Activity
    await Activity.create({
      user: userId,
      action: "comment_deleted",
      board: board._id,
      listId: card.list,
      cardId: card._id,
      entity: "card",
      entityId: card._id,
      details: { text: comment.text }
    });

    res.json({ message: "Comment removed successfully" });

  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Server error while deleting comment" });
  }
};


export const addChecklistToCard = async (req, res) => {
  const { id } = req.params; // card id
  const { title } = req.body;
  const userId = req.user?.id;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Checklist title is required" });
  }

  try {
    const card = await Card.findById(id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const { authorized, message, board } = await checkBoardMembership(card.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const newChecklist = { title, items: [] };
    card.checklists.push(newChecklist);
    await card.save();

    const addedChecklist = card.checklists[card.checklists.length - 1];

    // Activity
    await Activity.create({
      user: userId,
      action: "checklist_added",
      board: board._id,
      listId: card.list,
      cardId: card._id,
      entity: "checklist",
      entityId: addedChecklist._id,
      details: { title }
    });

    // Push notification
    const recipients = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipients,
      type: "checklist_added",
      title: `Checklist added: ${title}`,
      message: `A new checklist was added to card '${card.title}'`,
      referenceId: card._id,
      url: `/boards/${board._id}`
    });

    res.status(201).json(addedChecklist);

  } catch (err) {
    console.error("Error adding checklist:", err);
    res.status(500).json({ message: "Server error while adding checklist" });
  }
};

export const deleteChecklistFromCard = async (req, res) => {
  const { cardId, checklistId } = req.params;
  const userId = req.user?.id;

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const { authorized, message, board } = await checkBoardMembership(card.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const checklist = card.checklists.id(checklistId);
    if (!checklist) return res.status(404).json({ message: "Checklist not found" });

    const checklistTitle = checklist.title;
    card.checklists = card.checklists.filter((cl) => cl._id.toString() !== checklistId);
    await card.save();

    // Activity
    await Activity.create({
      user: userId,
      action: "checklist_deleted",
      board: board._id,
      listId: card.list,
      cardId: card._id,
      entity: "checklist",
      entityId: checklistId,
      details: { title: checklistTitle }
    });

    // Push notification
    const recipients = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipients,
      type: "checklist_deleted",
      title: `Checklist deleted: ${checklistTitle}`,
      message: `A checklist was removed from card '${card.title}'`,
      referenceId: card._id,
      url: `/boards/${board._id}`
    });

    res.json({ message: "Checklist removed successfully" });

  } catch (err) {
    console.error("Error deleting checklist:", err);
    res.status(500).json({ message: "Server error while deleting checklist" });
  }
};



// not pasted 


// pasted 


export const getCardById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const card = await Card.findById(id)
      .populate("members", "username email")
      .populate("comments.user", "username email")
      .populate("attachments.uploadedBy", "username email");

    if (!card) return res.status(404).json({ message: "Card not found" });

    const { authorized, message } = await checkBoardMembership(card.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    res.json(card);
  } catch (err) {
    console.error("[Get Card Error]", err);
    if (err.name === "CastError") return res.status(400).json({ message: "Invalid card ID" });
    res.status(500).json({ message: err.message });
  }
};



// -------------------- Reorder Cards --------------------
// -------------------- REORDER CARDS --------------------
export const reorderCardsInList = async (req, res) => {
  try {
    const { listId } = req.params;
    const { cardIdsInOrder } = req.body;
    const userId = req.user.id;

    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ message: "List not found" });

    const { authorized, message, board } = await checkBoardMembership(list.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const bulkOps = cardIdsInOrder.map((id, index) => ({
      updateOne: { filter: { _id: id, list: listId }, update: { $set: { order: index } } }
    }));
    await Card.bulkWrite(bulkOps);

    list.cards = cardIdsInOrder;
    await list.save();

    await Activity.create({
      user: userId,
      action: "cards_reordered",
      board: board._id,
      entity: "list",
      entityId: list._id,
      details: `Cards reordered in list '${list.name}'`
    });

    const recipients = board.members.filter(m => !m.equals(userId));
    if (recipients.length > 0) {
      await pushNotification({
        actor: userId,
        userIds: recipients,
        type: "cards_reordered",
        title: `Cards reordered in list '${list.name}'`,
        message: "Cards were reordered",
        referenceId: list._id,
        url: `/boards/${board._id}`
      });
    }

    res.json({ message: "Cards reordered successfully" });
  } catch (err) {
    console.error("[Reorder Cards Error]", err);
    res.status(500).json({ message: err.message });
  }
};

// -------------------- Move Card --------------------
// -------------------- Move Card --------------------
export const moveCardBetweenLists = async (req, res) => {
  console.log(req.body);
  try {
    const { cardId, fromListId, toListId, toIndex } = req.body;
    if (!cardId || !fromListId || !toListId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const fromList = await List.findById(fromListId);
    const toList = await List.findById(toListId);
    if (!fromList || !toList) return res.status(404).json({ message: "List not found" });

    const { authorized, message, board } = await checkBoardMembership(card.board, req.user.id);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    fromList.cards.pull(cardId);
    toList.cards.splice(toIndex, 0, cardId);
    await Promise.all([fromList.save(), toList.save()]);

    card.list = toListId;
    await card.save();

    await Activity.create({
      user: rreq.user?.id,
      action: "card_moved",
      board: board._id,
      entity: "card",
      entityId: card._id,
      details: `Card '${card.title}' moved from '${fromList.name}' to '${toList.name}'`
    });

    const recipients = board.members.filter((m) => m.toString() !== req.user.id);
    if (recipients.length > 0) {
      await pushNotification({
        actor: req.user?.id,
        userIds: recipients,
        type: "card_moved",
        title: `Card moved: ${card.title}`,
        message: `Moved from '${fromList.name}' → '${toList.name}'`,
        referenceId: card._id,
        url: `/boards/${board._id}`
      });
    }

    res.json({ message: "Card moved successfully" });
    } catch (err) {
    console.error("[Move Error]", err);
    res.status(500).json({ message: err.message });
  }
};


// pasted 

// -------------------- CREATE CARD --------------------
// Create a new card
export const createNewCard = async (req, res) => {
  const { listId } = req.params;
  const { title, description } = req.body;
  const userId = req.user?.id;

  try {
    if (!listId || !title) {
      return res.status(400).json({ message: "List ID and title are required" });
    }
    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ message: "List not found" });

    const boardId = await Board.findById(list.board);
    if (!boardId) return res.status(404).json({ message: "Board not found" });

     const { authorized, message, board } = await checkBoardMembership(list.board, userId);
     if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const existingCards = await Card.find({ list: listId }).sort({ order: 1 });
    const newOrder = existingCards.length > 0 ? existingCards[existingCards.length - 1].order + 1 : 0;

    const card = await Card.create({
      title,
      description,
      list: listId,
      board: list.board,
      order: newOrder,
      createdBy: userId
    });

    await card.save();
    list.cards.push(card._id);
    await list.save();

    // Activity
    await Activity.create({
      user: userId,
      action: "card_created",
      board: board._id,
      listId,
      cardId: card._id,
      entity: "card",
      entityId: card._id,
      details: { title: card.title }
    });

    // Push notification
    const recipients = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipients,
      type: "card_created",
      title: `New card: ${card.title}`,
      message: `A new card was created in list '${list.title}'`,
      referenceId: card._id,
      url: `/boards/${board._id}`
    });

    res.status(201).json(card);

  } catch (err) {
    console.error("Error creating card:", err);
    res.status(500).json({ message: "Server error while creating card" });
  }
};

// Update a card
export const updateEditCard = async (req, res) => {
  const { cardId } = req.params; // card id
  const { title, description, dueDate } = req.body;
  const userId = req.user?.id;

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const boardId = await Board.findById(card.board);
    if (!boardId) return res.status(404).json({ message: "Board not found" });

    const { authorized, message, board } = await checkBoardMembership(card.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const oldTitle = card.title;
    if (title) card.title = title;
    if (description) card.description = description;
    if (dueDate) card.dueDate = dueDate;

    const updatedCard = await card.save();

    // Activity
    await Activity.create({
      user: userId,
      action: "card_updated",
      board: board._id,
      listId: card.list,
      cardId: card._id,
      entity: "card",
      entityId: card._id,
      details: { oldTitle, newTitle: updatedCard.title }
    });

    // Push notification
    const recipients = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipients,
      type: "card_updated",
      title: `Card updated: ${updatedCard.title}`,
      message: `Card '${oldTitle}' was updated in board '${board.title}'`,
      referenceId: card._id,
      url: `/boards/${board._id}`
    });

    res.json(updatedCard);

  } catch (err) {
    console.error("Error updating card:", err);
    res.status(500).json({ message: "Server error while updating card" });
  }
};

// Delete a card
export const deleteDeleteCard = async (req, res) => {
  const { cardId } = req.params; // card id
  const userId = req.user?.id;

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const boardId = await Board.findById(card.board);
    if (!boardId) return res.status(404).json({ message: "Board not found" });

    const { authorized, message, board } = await checkBoardMembership(card.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const list = await List.findById(card.list);
    if (list) {
      list.cards = list.cards.filter((c) => !c.equals(cardId));
      list.cards.pull(card._id);
      await list.save();
    }

    await Card.deleteOne({ _id: cardId });

    // Activity
    await Activity.create({
      user: userId,
      action: "card_deleted",
      board: board._id,
      listId: card.list,
      cardId: cardId,
      entity: "card",
      entityId: cardId,
      details: { title: card.title }
    });

    // Push notification
    const recipients = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipients,
      type: "card_deleted",
      title: `Card deleted: ${card.title}`,
      message: `Card '${card.title}' was deleted from board '${board.title}'`,
      referenceId: cardId,
      url: `/boards/${board._id}`
    });

    res.json({ message: "Card deleted successfully" });

  } catch (err) {
    console.error("Error deleting card:", err);
    res.status(500).json({ message: "Server error while deleting card" });
  }
};

// Reorder cards within a list
export const reorderCards = async (req, res) => {
  const { listId } = req.params;
  const { orderedIds } = req.body;
  const userId = req.user?.id;

  try {
    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ message: "List not found" });

    const { authorized, message, board } = await checkBoardMembership(list.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    await Promise.all(
      orderedIds.map((id, index) => Card.findByIdAndUpdate(id, { order: index }))
    );
    list.cards = orderedIds;
    await list.save();

    // Activity
    await Activity.create({
      user: userId,
      action: "cards_reordered",
      board: board._id,
      listId,
      entity: "card",
      details: { order: orderedIds }
    });

    res.status(200).json({ message: "Cards reordered successfully" });

  } catch (err) {
    console.error("Error reordering cards:", err);
    res.status(500).json({ message: "Server error while reordering cards" });
  }
};

// -------------------- MOVE CARD --------------------
export const moveCard = async (req, res) => {
  try {
    const { cardId, fromListId, toListId, toIndex, targetCardId } = req.body;
    console.log(req.body);
    const userId = req.user.id;

    if (!cardId || !fromListId || !toListId) return res.status(400).json({ message: "Missing required fields" });

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const fromList = await List.findById(fromListId);
    const toList = await List.findById(toListId);
    if (!fromList || !toList) return res.status(404).json({ message: "List not found" });

    const { authorized, message, board } = await checkBoardMembership(card.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    fromList.cards.pull(card._id);

    let cardsInTarget = await Card.find({ list: toListId, _id: { $ne: cardId } }).sort({ order: 1 });
    if (typeof toIndex === "number") {
      cardsInTarget.splice(toIndex, 0, card);
    } else if (targetCardId) {
      const targetIndex = cardsInTarget.findIndex(c => c._id.toString() === targetCardId);
      if (targetIndex === -1) return res.status(404).json({ message: "Target card not found" });
      cardsInTarget.splice(targetIndex + 1, 0, card);
    } else {
      cardsInTarget.push(card);
    }

    for (let i = 0; i < cardsInTarget.length; i++) {
      cardsInTarget[i].order = i;
      await cardsInTarget[i].save();
    }

    toList.cards = cardsInTarget.map(c => c._id);
    await Promise.all([toList.save(), fromListId !== toListId ? fromList.save() : Promise.resolve()]);

    if (fromListId !== toListId) {
      card.list = toListId;
      await card.save();
    }

    await Activity.create({
      user: userId,
      action: "card_moved",
      board: board._id,
      entity: "card",
      entityId: card._id,
      details: `Card '${card.title}' moved from '${fromList.name}' to '${toList.name}'`
    });

    const recipients = board.members.filter(m => !m.equals(userId));
    if (recipients.length > 0) {
      await pushNotification({
        actor: userId,
        userIds: recipients,
        type: "card_moved",
        title: `Card moved: ${card.title}`,
        message: `Card moved from '${fromList.name}' → '${toList.name}'`,
        referenceId: card._id,
        url: `/boards/${board._id}`
      });
    }

    res.json({ message: "Card moved successfully", card });
  } catch (err) {
    console.error("[Move Card Error]", err);
    res.status(500).json({ message: err.message });
  }
};






// -------------------- CHECKLIST ITEMS --------------------




// Add checklist item
export const addChecklistItem = async (req, res) => {
  try {
    const { cardId, checklistId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Checklist item text is required" });
    }

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const { authorized, message, board } = await checkBoardMembership(card.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const checklist = card.checklists.id(checklistId);
    if (!checklist) return res.status(404).json({ message: "Checklist not found" });

    const newItem = { text, isCompleted: false };
    checklist.items.push(newItem);
    await card.save();

    const addedItem = checklist.items[checklist.items.length - 1];

    await Activity.create({
      user: userId,
      action: "checklist_item_created",
      board: board._id,
      cardId: card._id,
      entity: "checklist_item",
      entityId: addedItem._id,
      details: { checklist: checklist.title, text: addedItem.text, completed: false },
    });

    const recipients = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipients,
      type: "checklist_item_created",
      title: `Checklist item added: ${addedItem.text}`,
      message: `Item added to checklist '${checklist.title}' in card '${card.title}'`,
      referenceId: card._id,
      url: `/boards/${board._id}/cards/${card._id}`,
    });

    res.status(201).json(addedItem);
  } catch (err) {
    console.error("Error adding checklist item:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteChecklistItem = async (req, res) => {
  const { cardId, checklistId, itemId } = req.params;
  const userId = req.user?.id;

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const { authorized, message, board } = await checkBoardMembership(card.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const checklist = card.checklists.id(checklistId);
    if (!checklist) return res.status(404).json({ message: "Checklist not found" });

    const item = checklist.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Checklist item not found" });

    const itemText = item.text;
    item.remove();
    await card.save();

    // Activity
    await Activity.create({
      user: userId,
      action: "item_deleted",
      board: board._id,
      listId: card.list,
      cardId: card._id,
      entity: "checklist_item",
      entityId: itemId,
      details: { text: itemText }
    });

    // Push notification
    const recipients = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipients,
      type: "item_deleted",
      title: `Checklist item deleted`,
      message: `Item '${itemText}' was removed from checklist '${checklist.title}' in card '${card.title}'`,
      referenceId: card._id,
      url: `/boards/${board._id}`
    });

    res.json({ message: "Checklist item removed successfully" });

  } catch (err) {
    console.error("Error deleting checklist item:", err);
    res.status(500).json({ message: "Server error while deleting checklist item" });
  }
};

/* NEW */

// Update checklist item (text & completion)
export const updateChecklistItem = async (req, res) => {
  const { cardId, checklistId, itemId } = req.params;
  const { text, completed } = req.body;
  const userId = req.user?.id;

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const { authorized, message, board } = await checkBoardMembership(card.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const checklist = card.checklists.id(checklistId);
    if (!checklist) return res.status(404).json({ message: "Checklist not found" });

    const item = checklist.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Checklist item not found" });

    if (text !== undefined) item.text = text;
    if (completed !== undefined) item.isCompleted = completed;

    await card.save();

    await Activity.create({
      user: userId,
      action: "checklist_item_updated",
      board: board._id,
      cardId: card._id,
      entity: "checklist_item",
      entityId: item._id,
      details: { checklist: checklist.title, text: item.text, completed: item.isCompleted },
    });

    const recipients = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipients,
      type: "checklist_item_updated",
      title: `Checklist item updated: ${item.text}`,
      message: `Item in checklist '${checklist.title}' on card '${card.title}' was updated`,
      referenceId: card._id,
      url: `/boards/${board._id}/cards/${card._id}`,
    });

    res.json(item);
  } catch (error) {
    console.error("Error updating checklist item:", error);
    res.status(500).json({ message: "Server error while updating checklist item" });
  }
};


// ✅ Update checklist item text
export const updateChecklistItemText = async (req, res) => {
  const { cardId, checklistId, itemId } = req.params;
  const { text } = req.body;
  const userId = req.user?.id;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Checklist item text is required" });
  }

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const { authorized, message, board } = await checkBoardMembership(card.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const checklist = card.checklists.id(checklistId);
    if (!checklist) return res.status(404).json({ message: "Checklist not found" });

    const item = checklist.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Checklist item not found" });

    const oldText = item.text;
    item.text = text;
    await card.save();

    // Activity
    await Activity.create({
      user: userId,
      action: "item_updated",
      board: board._id,
      listId: card.list,
      cardId: card._id,
      entity: "checklist_item",
      entityId: item._id,
      details: { oldText, newText: text }
    });

    // Push notification
    const recipients = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipients,
      type: "item_updated",
      title: `Checklist item updated`,
      message: `Item '${oldText}' updated to '${text}' in checklist '${checklist.title}' of card '${card.title}'`,
      referenceId: card._id,
      url: `/boards/${board._id}`
    });

    res.json(item);

  } catch (err) {
    console.error("Error updating checklist item:", err);
    res.status(500).json({ message: "Server error while updating checklist item" });
  }
};

// not pasted

// Get all cards for a specific list
// -------------------- CARDS BY LIST --------------------
export const getCardsByList = async (req, res) => {
  try {
    const { listId } = req.params;
    const cards = await Card.find({ list: listId }).sort({ order: 1 });
    res.status(200).json(cards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching cards" });
  }
};

// Add checklist
/* NEW */
// -------------------- CHECKLISTS --------------------

// Add checklist
export const addChecklist = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { title } = req.body;
    const userId = req.user?.id;

    if (!title) return res.status(400).json({ message: "Checklist title is required" });

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const checklist = { title, items: [] };
    card.checklists.push(checklist);
    await card.save();

    // Activity log
    await Activity.create({
      user: userId,
      action: "checklist_created",
      board: card.board,
      cardId: card._id,
      entity: "checklist",
      entityId: checklist._id,
      details: { title },
    });

    // Push notification
    const board = await Board.findById(card.board);
    const recipients = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipients,
      type: "checklist_created",
      title: `New checklist: ${title}`,
      message: `A new checklist was added to card '${card.title}'`,
      referenceId: card._id,
      url: `/boards/${board._id}/cards/${card._id}`,
    });

    res.status(201).json(card.checklists.slice(-1)[0]);
  } catch (err) {
    console.error("Error adding checklist:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete checklist
export const deleteChecklist = async (req, res) => {
  try {
    const { cardId, checklistId } = req.params;
    const userId = req.user?.id;

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const checklist = card.checklists.id(checklistId);
    if (!checklist) return res.status(404).json({ message: "Checklist not found" });

    const checklistTitle = checklist.title;
    checklist.remove();
    await card.save();

    await Activity.create({
      user: userId,
      action: "checklist_deleted",
      board: card.board,
      cardId: card._id,
      entity: "checklist",
      entityId: checklistId,
      details: { title: checklistTitle },
    });

    const board = await Board.findById(card.board);
    const recipients = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipients,
      type: "checklist_deleted",
      title: `Checklist deleted: ${checklistTitle}`,
      message: `Checklist '${checklistTitle}' was deleted from card '${card.title}'`,
      referenceId: card._id,
      url: `/boards/${board._id}/cards/${card._id}`,
    });

    res.status(200).json({ message: "Checklist removed" });
  } catch (err) {
    console.error("Error deleting checklist:", err);
    res.status(500).json({ message: err.message });
  }
};

// Add checklist item
/* NEW */
export const addChecklistItems = async (req, res) => {
  try {
    const { cardId, checklistId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;

    if (!text) return res.status(400).json({ message: "Item text is required" });

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const checklist = card.checklists.id(checklistId);
    if (!checklist) return res.status(404).json({ message: "Checklist not found" });

    const newItem = { text, completed: false };
    checklist.items.push(newItem);
    await card.save();

    // 🔹 Activity log
    await Activity.create({
      user: userId,
      action: "checklist_item_created",
      board: card.board,
      cardId: card._id,
      entity: "checklist_item",
      entityId: checklist.items.slice(-1)[0]._id,
      details: { checklist: checklist.title, text, completed: false }
    });

    // 🔹 Push notification
    const board = await Board.findById(card.board);
    const recipients = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipients,
      type: "checklist_item_created",
      title: `Checklist item added: ${text}`,
      message: `Item added to checklist '${checklist.title}' in card '${card.title}'`,
      referenceId: card._id,
      url: `/boards/${board._id}/cards/${card._id}`
    });

    res.status(201).json(checklist.items.slice(-1)[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Toggle checklist item completion
/* NEW */
export const toggleChecklistItems = async (req, res) => {
  try {
    const { cardId, checklistId, itemId } = req.params;
    const userId = req.user?.id;
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const checklist = card.checklists.id(checklistId);
    if (!checklist) return res.status(404).json({ message: "Checklist not found" });

    const item = checklist.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.completed = !item.completed;
    await card.save();

    // 🔹 Activity log
    await Activity.create({
      user: userId,
      action: item.completed ? "checklist_item_completed" : "checklist_item_reopened",
      board: card.board,
      cardId: card._id,
      entity: "checklist_item",
      entityId: item._id,
      details: { checklist: checklist.title, text: item.text, completed: item.completed }
    });

    // 🔹 Push notification
    const board = await Board.findById(card.board);
    const recipients = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipients,
      type: item.completed ? "checklist_item_completed" : "checklist_item_reopened",
      title: `Checklist item updated: ${item.text}`,
      message: `Item in checklist '${checklist.title}' on card '${card.title}' was marked as ${item.completed ? "completed" : "incomplete"}`,
      referenceId: card._id,
      url: `/boards/${board._id}/cards/${card._id}`
    });

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Toggle checklist item completion
export const toggleChecklistItemCompletion = async (req, res) => {
  const { cardId, checklistId, itemId } = req.params;
  const userId = req.user?.id;

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const { authorized, message, board } = await checkBoardMembership(card.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const checklist = card.checklists.id(checklistId);
    if (!checklist) return res.status(404).json({ message: "Checklist not found" });

    const item = checklist.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Checklist item not found" });

    item.isCompleted = !item.isCompleted;
    await card.save();

    const status = item.isCompleted ? "completed" : "marked incomplete";

    await Activity.create({
      user: userId,
      action: "item_toggled",
      board: board._id,
      cardId: card._id,
      entity: "checklist_item",
      entityId: item._id,
      details: { text: item.text, status },
    });

    const recipients = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipients,
      type: "item_toggled",
      title: `Checklist item ${status}`,
      message: `Item '${item.text}' in checklist '${checklist.title}' of card '${card.title}' was ${status}`,
      referenceId: card._id,
      url: `/boards/${board._id}`,
    });

    res.json(item);
  } catch (err) {
    console.error("Error toggling checklist item completion:", err);
    res.status(500).json({ message: "Server error while toggling checklist item" });
  }
};


// Delete checklist item
/* NEW */

// Delete checklist item
export const deleteChecklistItems = async (req, res) => {
  const { cardId, checklistId, itemId } = req.params;
  const userId = req.user?.id;

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const { authorized, message, board } = await checkBoardMembership(card.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const checklist = card.checklists.id(checklistId);
    if (!checklist) return res.status(404).json({ message: "Checklist not found" });

    const item = checklist.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Checklist item not found" });

    const itemText = item.text;
    item.remove();
    await card.save();

    await Activity.create({
      user: userId,
      action: "checklist_item_deleted",
      board: board._id,
      cardId: card._id,
      entity: "checklist_item",
      entityId: item._id,
      details: { checklist: checklist.title, text: itemText },
    });

    const recipients = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipients,
      type: "checklist_item_deleted",
      title: `Checklist item deleted: ${itemText}`,
      message: `Item '${itemText}' removed from checklist '${checklist.title}' in card '${card.title}'`,
      referenceId: card._id,
      url: `/boards/${board._id}/cards/${card._id}`,
    });

    res.status(200).json({ message: "Checklist item removed" });
  } catch (err) {
    console.error("Error deleting checklist item:", err);
    res.status(500).json({ message: err.message });
  }
};


// ---------- ADD COMMENT ----------
// -------------------- COMMENTS --------------------
export const addComment = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;

    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const newComment = { text, user: userId, createdAt: new Date() };
    card.comments.push(newComment);
    await card.save();

    await Activity.create({
      user: userId,
      action: "comment_created",
      board: card.board,
      cardId: card._id,
      entity: "comment",
      entityId: card.comments.slice(-1)[0]._id,
      details: { text },
    });

    const board = await Board.findById(card.board);
    const recipients = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipients,
      type: "comment_created",
      title: `New comment on card: ${card.title}`,
      message: `A new comment was added: "${text}"`,
      referenceId: card._id,
      url: `/boards/${board._id}/cards/${card._id}`,
    });

    const populatedCard = await Card.findById(card._id).populate("comments.user", "username");
    res.status(201).json(populatedCard.comments.slice(-1)[0]);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { cardId, commentId } = req.params;
    const userId = req.user?.id;

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const comment = card.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const board = await Board.findById(card.board);
    if (!board) return res.status(404).json({ message: "Board not found" });

    if (comment.user.toString() !== userId && board.owner.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    const commentText = comment.text;
    comment.remove();
    await card.save();

    await Activity.create({
      user: userId,
      action: "comment_deleted",
      board: card.board,
      cardId: card._id,
      entity: "comment",
      entityId: commentId,
      details: { text: commentText },
    });

    const recipients = board.members.filter((m) => !m.equals(userId));
    await pushNotification({
      actor: userId,
      userIds: recipients,
      type: "comment_deleted",
      title: `Comment deleted on card: ${card.title}`,
      message: `Comment removed: "${commentText}"`,
      referenceId: card._id,
      url: `/boards/${board._id}/cards/${card._id}`,
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: err.message });
  }
};


// Upload attachment (local + Cloudinary)

// -------------------- ATTACHMENTS --------------------
export const uploadAttachment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const card = await Card.findById(id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const { authorized, message } = await checkBoardMembership(card.board, userId);
    if (!authorized) {
      if (req.file) await fs.unlink(req.file.path).catch(console.error);
      return res.status(message === "Board not found" ? 404 : 403).json({ message });
    }

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    let fileUrl;
    if (process.env.USE_CLOUDINARY === "true") {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "attachments",
        resource_type: "auto",
      });
      fileUrl = result.secure_url;
      await fs.unlink(req.file.path).catch(console.error);
    } else {
      const filename = req.file.filename;
      fileUrl = `/${path.relative("public", path.join(UPLOAD_DIR, filename)).replace(/\\/g, "/")}`;
    }

    const newAttachment = {
      filename: req.file.originalname,
      url: fileUrl,
      mimetype: req.file.mimetype,
      uploadedBy: userId,
      uploadedAt: new Date(),
    };

    card.attachments.push(newAttachment);
    await card.save();

    const populatedAttachment = card.attachments[card.attachments.length - 1];
    await User.populate(populatedAttachment, { path: "uploadedBy", select: "name email" });

    res.status(201).json(populatedAttachment);
  } catch (error) {
    console.error("Error uploading attachment:", error);
    if (req.file) await fs.unlink(req.file.path).catch(console.error);
    res.status(500).json({ message: "Server error while uploading attachment" });
  }
};


// Delete attachment (local + Cloudinary)

export const deleteAttachment = async (req, res) => {
  const { cardId, attachmentId } = req.params;
  const userId = req.user?.id;

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const { authorized, message, board } = await checkBoardMembership(card.board, userId);
    if (!authorized) return res.status(message === "Board not found" ? 404 : 403).json({ message });

    const attachment = card.attachments.id(attachmentId);
    if (!attachment) return res.status(404).json({ message: "Attachment not found" });

    const isUploader = attachment.uploadedBy.equals(userId);
    const isBoardOwner = board.owner.equals(userId);

    if (!isUploader && !isBoardOwner) return res.status(403).json({ message: "Not authorized to delete this attachment" });

    if (attachment.url.startsWith("http") && process.env.USE_CLOUDINARY === "true") {
      const publicId = attachment.url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`attachments/${publicId}`, { resource_type: "auto" }).catch(console.error);
    } else {
      const filePath = path.join(UPLOAD_DIR, path.basename(attachment.url));
      await fs.unlink(filePath).catch(console.error);
    }

    attachment.remove();
    await card.save();
    res.json({ message: "Attachment removed successfully" });
  } catch (error) {
    console.error("Error deleting attachment:", error);
    res.status(500).json({ message: "Server error while deleting attachment" });
  }
};



