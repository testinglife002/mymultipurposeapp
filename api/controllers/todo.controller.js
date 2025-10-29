// // controllers/todo.controller.js
// controllers/todo.controller.js
import { scheduleTodoReminders } from "../utils/whatsappReminder.js";
import User from "../models/user.model.js";
import Todo from "../models/todo.model.js";
import mongoose from "mongoose";
import dayjs from "dayjs"; // optional, or use native Date
// import { pushNotification } from "../utils/notify.js";
import { notify } from "../utils/notification.js";
import { pushNotification } from "../utils/pushNotification.js"; // ✅ unified import



// Helper: validate ownership
const ensureOwner = (todo, userId) => {
  if (!todo) throw { status: 404, message: "Todo not found" };
  if (todo.userId.toString() !== userId) throw { status: 403, message: "Unauthorized" };
};




// Create new todo
/*
export const createTodo = async (req, res) => {
  console.log(req.body);
  try {
    const {
      title,
      description,
      start,
      end,
      projectId,
      recurrence,
      priority,
      // notifyVia,
      subtodos = [],
      tags = [],
      reminder = '',
      marked = false,
      color = '',
    } = req.body;

    // Convert and validate reminder
    let parsedReminder = null;
    if (reminder) {
      const parsed = new Date(reminder);
      if (!isNaN(parsed)) {
        parsedReminder = parsed;
      } else {
        return res.status(400).json({ error: "Invalid reminder date format" });
      }
    }

     // Calculate duration (in minutes)
    const startTime = new Date(start);
    const endTime = new Date(end);
    const duration = (endTime - startTime) / (1000 * 60); // duration in minutes

    // Calculate completedPercent
    const total = subtodos.length;
    const completed = subtodos.filter((t) => t.completed).length;
    const completedPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

    const todo = new Todo({
      title,
      description,
      dueDate,
      start,
      end,
      startDateTime,
      endDateTime,
      duration,
      projectId,
      userId: req.userId,
      completedPercent,
      recurrence,
      priority,
      color,
      reminder: parsedReminder, // ← fixed
      // notifyVia,
      tags,
      subtodos,
      marked,
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    console.error("Todo creation failed:", err);
    res.status(500).json({ error: "Failed to create todo", details: err });
  }
};
*/

// ✅ CREATE TODO with push notification
// ✅ CREATE TODO FIXED
export const createTodo = async (req, res) => {
  try {
    const {
      title,
      description,
      start,
      end,
      dueDate,
      projectId,
      status,
      priority,
      recurrence,
      reminder,
      remindMe,
      color,
      notifyVia,
      tags,
      subtodos,
      marked,
      completed,
      comments,
    } = req.body;

    const userId = req.user?.id;
    
    if (!title  || !userId) {
      return res.status(400).json({ error: "Title, projectId, and userId are required." });
    }

    // Normalize remindMe
    let normalizedRemindMe = [];
    if (Array.isArray(remindMe)) {
      normalizedRemindMe = remindMe;
    } else if (typeof remindMe === "string" && remindMe.trim() !== "") {
      // convert ISO date string → single remind time entry
      normalizedRemindMe = [{ type: "day", value: 1 }]; // default fallback
    }

    // Normalize comments
    let normalizedComments = [];
    if (Array.isArray(comments)) {
      normalizedComments = comments;
    } else if (typeof comments === "string" && comments.trim() !== "") {
      normalizedComments = [
        {
          text: comments,
          author: userId,
        },
      ];
    }

    let duration = 0;
    if (start && end) {
      const diffMs = new Date(end) - new Date(start);
      if (diffMs > 0) duration = Math.min(Math.round(diffMs / 60000), 14400);
    }

    let dueStatus = "no-due-date";
    if (dueDate) {
      const now = new Date();
      const due = new Date(dueDate);
      if (due < now) dueStatus = "overdue";
      else dueStatus = (due - now) / (1000 * 60 * 60) <= 48 ? "due-soon" : "due-later";
    }

    const completedPercent =
      subtodos?.length > 0
        ? Math.round((subtodos.filter((s) => s.completed).length / subtodos.length) * 100)
        : 0;

    const todo = await Todo.create({
      title,
      description,
      start: start ? new Date(start) : null,
      end: end ? new Date(end) : null,
      dueDate: dueDate ? new Date(dueDate) : null,
      duration,
      projectId: new mongoose.Types.ObjectId(projectId),
      userId: new mongoose.Types.ObjectId(userId),
      status: status?.toLowerCase() || "pending",
      priority: priority?.toLowerCase() || "medium",
      recurrence: recurrence || "none",
      reminder: reminder ? new Date(reminder) : null,
      remindMe: normalizedRemindMe,
      color: color || "#000000",
      notifyVia: notifyVia || [],
      tags: [...new Set(tags || [])],
      subtodos: subtodos || [],
      marked: !!marked,
      completed: !!completed,
      comments: normalizedComments,
      dueStatus,
      completedPercent,
    });

    await pushNotification({
      actor: userId,
      user: userId,
      type: "todo_created",
      title: `Todo "${todo.title}" created`,
      message: `📋 Todo "${todo.title}" created with ${priority} priority.`,
      referenceId: todo._id,
      url: `/todos/${todo._id}`,
    });

    // ✅ Get user’s WhatsApp number dynamically
    const user = await User.findById(userId);
    if (user?.phone) {
      scheduleTodoReminders(todo, user);
    } else {
      console.warn("⚠️ No WhatsApp number found for user:", userId);
    }

    res.status(201).json({ status: true, todo, message: "Todo created successfully." });
  } catch (err) {
    console.error("❌ Error creating todo:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};





/*
export const createTodo = async (req, res) => {
  try {
    const { title, description, dueDate, projectId, recurrence } = req.body;
    const todo = new Todo({
      title,
      description,
      dueDate,
      projectId,
      userId: req.userId,
      recurrence, // "daily", "weekly", "monthly"
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: "Failed to create todo", details: err });
  }
};
*/

// Get all todos for current user (optional project filter) 
export const getTodos = async (req, res) => {
  try {
    const { projectId, search } = req.query;
    const userId = req.user?.id;
    const filter = { userId: userId };
    if (projectId) filter.projectId = projectId;
    if (search) filter.text = { $regex: search, $options: "i" };

    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Failed to get todos", details: err });
  }
};

export const getTodosByProject = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user?.id;
  try {
    const todos = await Todo.find({ projectId, userId }).sort({ dueDate: 1 });
    res.json(todos);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// controllers/todos.controller.js
// import Todo from "../models/todo.model.js"; // Your Todo model

// GET /api/todos/:id
// import mongoose from "mongoose";

export const getTodoById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Todo ID" });
  }

  try {
    const todo = await Todo.findById(id).populate("subtodos");

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    res.status(200).json(todo);
  } catch (err) {
    console.error("Error fetching todo:", err);
    res.status(500).json({ message: "Server error" });
  }
};




// ✅ UPDATE TODO
export const updateTodo = async (req, res) => {
  try {
    const userId = req.user?.id;
    const updated = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json("Todo not found or unauthorized");

    await pushNotification({
      actor: userId,
      user: userId,
      type: "todo_updated",
      title: `Todo "${updated.title}" updated`,
      message: `Your todo "${updated.title}" was modified.`,
      referenceId: updated._id,
      url: `/todos/${updated._id}`,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo", details: err });
  }
};



// ✅ DELETE TODO
export const deleteTodo = async (req, res) => {
  try {
    const userId = req.user?.id;
    const deleted = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: userId,
    });
    if (!deleted) return res.status(404).json("Todo not found or unauthorized");

    await pushNotification({
      actor: userId,
      user: userId,
      type: "todo_deleted",
      title: `Todo "${deleted.title}" deleted`,
      message: `Todo "${deleted.title}" has been deleted.`,
      referenceId: deleted._id,
    });

    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo", details: err });
  }
};



// ALMOST THERE
export const addSubtask = async (req, res) => {
  const { todoId } = req.params;
  const { title } = req.body;

  try {
    const todo = await Todo.findById(todoId);
    if (!todo) return res.status(404).json("Todo not found");

    todo.subtasks.push({ title });
    await todo.save();
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const toggleSubtask = async (req, res) => {
  const { todoId, subtaskIndex } = req.params;

  try {
    const todo = await Todo.findById(todoId);
    if (!todo) return res.status(404).json("Todo not found");

    todo.subtasks[subtaskIndex].completed = !todo.subtasks[subtaskIndex].completed;
    await todo.save();
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const reorderTodos = async (req, res) => {
  const { projectId } = req.params;
  const { orderedIds } = req.body;

  try {
    for (let i = 0; i < orderedIds.length; i++) {
      await Todo.findByIdAndUpdate(orderedIds[i], { order: i });
    }
    res.status(200).json("Order updated");
  } catch (err) {
    res.status(500).json(err.message);
  }
};


// ITS NEW GENERATION

export const getTodosByDate = async (req, res) => {
  try {
    const { date } = req.params; // format: YYYY-MM-DD
    const userId = req.user?.id;

    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const todos = await Todo.find({
      userId,
      dueDate: { $gte: start, $lt: end },
    });

    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: "Failed to get todos by date", error: err });
  }
};

export const getTodosByDateRange = async (req, res) => {
  try {
    const { start, end } = req.query;
    const userId = req.user?.id;
    const todos = await Todo.find({
      userId: userId,
      dueDate: {
        $gte: new Date(start),
        $lte: new Date(end)
      }
    }).sort({ dueDate: 1 });

    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching todos in range', error: err.message });
  }
};


export const getNext7DaysTodos = async (req, res) => {
  try {
    const userId = req.user?.id;
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const todos = await Todo.find({
      userId,
      dueDate: { $gte: today, $lte: nextWeek },
    });

    // Group todos by date
    const grouped = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
      grouped[dateStr] = [];
    }

    todos.forEach(todo => {
      const dateStr = todo.dueDate.toISOString().split("T")[0];
      if (grouped[dateStr]) grouped[dateStr].push(todo);
    });

    res.status(200).json(grouped);
  } catch (err) {
    res.status(500).json({ message: "Failed to get todos for next 7 days", error: err });
  }
};


/*
export const duplicateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const originalTodo = await Todo.findById(id);
    if (!originalTodo) return res.status(404).json({ message: "Todo not found" });

    const clonedTodo = new Todo({
      ...originalTodo.toObject(),
      _id: mongoose.Types.ObjectId(),
      isNew: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await clonedTodo.save();
    res.status(201).json(clonedTodo);
  } catch (err) {
    res.status(500).json({ message: "Failed to duplicate todo", error: err });
  }
};
*/


// controllers/todo.controller.js

export const getTodosByFilter = async (req, res) => {
  const { filter } = req.query;
  const userId = req.user?.id;

  try {
    let query = { userId };

    if (filter === 'today') {
      const today = dayjs().startOf('day').toDate();
      const tomorrow = dayjs().add(1, 'day').startOf('day').toDate();
      query.dueDate = { $gte: today, $lt: tomorrow };
    } else if (filter === 'this-week') {
      const start = dayjs().startOf('day').toDate();
      const end = dayjs().add(7, 'day').endOf('day').toDate();
      query.dueDate = { $gte: start, $lte: end };
    } else if (filter === 'inbox') {
      query.isInbox = true;
    }

    const todos = await Todo.find(query).sort({ dueDate: 1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos." });
  }
};

export const duplicateTodo = async (req, res) => {
  const todoId = req.params.id;
  const userId = req.user?.id;

  try {
    const todo = await Todo.findById(todoId);
    if (!todo) return res.status(404).json({ error: "Todo not found" });

    const clonedTodo = new Todo({
      title: todo.title + " (Copy)",
      description: todo.description,
      dueDate: todo.dueDate,
      completed: false,
      projectId: todo.projectId,
      userId: userId,
      recurrence: todo.recurrence,
      tags: todo.tags || [],
      subtodos: todo.subtodos || [],
    });

    await clonedTodo.save();

    // 🔔 Notify
    await notify({
      user: userId,
      actor: userId,
      type: "todo_duplicated",
      title: "Todo Duplicated",
      message: `Your todo "${todo.title}" was duplicated`,
      referenceId: clonedTodo._id,
      url: `/todos/${clonedTodo._id}`
    });

    res.status(201).json(clonedTodo);
  
  } catch (err) {
    res.status(500).json({ error: "Failed to duplicate todo" });
  }
};


export const getMarkedTodos = async (req, res) => {
  try {
    const userId = req.user?.id;
    const todos = await Todo.find({
      userId: userId,
      marked: true,
    }).sort({ dueDate: 1 });

    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching marked todos', error: err.message });
  }
};


// Get all projects created by the current user
// ✅ GET MY TODOS (for /todos/my-todos)
export const getMyTodos = async (req, res) => {
  try {
    const userId = req.user?.id;
    const mytodos = await Todo.find({ userId });
    res.json(mytodos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ✅ ADD SUBTODO
export const addSubtodo = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { todoId } = req.params;
    const { title, priority, completed } = req.body;


    if (!title) return res.status(400).json({ message: "Subtodo title is required" });

    const todo = await Todo.findById(todoId);
    ensureOwner(todo, userId);

    const newSubtodo = { title, priority, completed };
    todo.subtodos.push(newSubtodo);
    await todo.save();

    await pushNotification({
      actor: userId,
      user: userId,
      type: "subtodo_created",
      title: `Subtodo added`,
      message: `A new subtodo "${title}" was added to "${todo.title}"`,
      referenceId: todo._id,
      url: `/todos/${todo._id}`,
    });

    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
};

// ✅ EDIT SUBTODO
export const editSubtodo = async (req, res, next) => {
  try {
    const { todoId, subtodoId } = req.params;
    const { title, priority, completed } = req.body;
    const userId = req.user?.id;
    const todo = await Todo.findById(todoId);
    ensureOwner(todo, userId);

    const st = todo.subtodos.id(subtodoId);
    if (!st) throw { status: 404, message: "Subtodo not found" };

    if (title !== undefined) st.title = title;
    if (priority !== undefined) st.priority = priority;
    if (completed !== undefined) st.completed = completed;
    await todo.save();

    await pushNotification({
      actor: userId,
      user: userId,
      type: "subtodo_updated",
      title: `Subtodo updated`,
      message: `Subtodo "${st.title}" in "${todo.title}" was updated.`,
      referenceId: todo._id,
    });

    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
};

// ✅ DELETE SUBTODO
export const deleteSubtodo = async (req, res, next) => {
  try {
    const { todoId, subtodoId } = req.params;
    const todo = await Todo.findById(todoId);
    const userId = req.user?.id;
    ensureOwner(todo, userId);

    const st = todo.subtodos.id(subtodoId);
    if (!st) return res.status(404).json({ message: "Subtodo not found" });

    const deletedTitle = st.title;

    // ✅ FIXED: use deleteOne instead of remove
    st.deleteOne();
    await todo.save();

    await pushNotification({
      actor: userId,
      user: userId,
      type: "subtodo_deleted",
      title: `Subtodo deleted`,
      message: `Subtodo "${deletedTitle}" removed from "${todo.title}"`,
      referenceId: todo._id,
    });

    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
};


// 🗓️ Get Todos by Specific Date
export const getTodosByDayDate = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const day = dayjs(req.params.date);
    const start = day.startOf("day").toDate();
    const end = day.endOf("day").toDate();
    const todos = await Todo.find({
      userId: userId,
      startDateTime: { $gte: start, $lte: end },
    });
    res.status(200).json(todos);
  } catch (err) {
    next(err);
  }
};

// 🕐 Get Today’s Todos
export const getTodosToday = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const day = dayjs();
    const start = day.startOf("day").toDate();
    const end = day.endOf("day").toDate();
    const todos = await Todo.find({
      userId: userId,
      // startDateTime: { $gte: start, $lte: end },
      dueDate: { $gte: start, $lte: end }
    });
    res.status(200).json(todos);
  } catch (err) {
    next(err);
  }
};

// 📆 Get This Week’s Todos (grouped by day)
export const getTodosThisWeek = async (req, res, next) => {
  try {
    const startWeek = dayjs().startOf("week");
    const days = Array.from({ length: 7 }).map((_, i) => {
      const day = startWeek.add(i, "day");
      return {
        date: day.format("YYYY-MM-DD"),
        start: day.startOf("day").toDate(),
        end: day.endOf("day").toDate(),
      };
    });

    const results = {};
    for (const d of days) {
      const todos = await Todo.find({
        userId: req.userId,
        // startDateTime: { $gte: d.start, $lte: d.end },
        dueDate: { $gte: d.start, $lte: d.end },

      });
      results[d.date] = todos;
    }
    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

// ✅ Additional Filtering: due today, next 7 days
export const filterTodos = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { filter } = req.query;
    const now = dayjs();
    let condition = { userId: userId };
    switch (filter) {
      case "due-today":
        condition.dueDate = {
          $gte: now.startOf("day").toDate(),
          $lte: now.endOf("day").toDate(),
        };
        break;
      case "next-7-days":
        condition.dueDate = {
          $gte: now.toDate(),
          $lte: now.add(7, "day").endOf("day").toDate(),
        };
        break;
      case "completed":
        condition.completed = true;
        break;
      default:
        // no filter
        break;
    }
    const todos = await Todo.find(condition);
    res.status(200).json(todos);
  } catch (err) {
    next(err);
  }
};

