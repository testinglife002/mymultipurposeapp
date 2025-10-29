// // routes/todo.routes.js
// routes/todo.routes.js
// routes/todo.routes.js
import express from "express";
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  getTodosByProject,
  addSubtask,
  toggleSubtask,
  reorderTodos,
  getTodosByDate,
  getNext7DaysTodos,
  duplicateTodo,
  getTodosByFilter,
  getMarkedTodos,
  getTodosByDateRange,
  getMyTodos,
  addSubtodo,
  getTodosToday,
  getTodosThisWeek,
  filterTodos,
  editSubtodo,
  deleteSubtodo,
  getTodosByDayDate,
  getTodoById,
} from "../controllers/todo.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import Todo from "../models/todo.model.js";
import Project from "../models/project.model.js";

const router = express.Router();

router.use(verifyToken);

// ✅ Specific first
router.get("/marked/all", getMarkedTodos);
router.get("/filter", getTodosByFilter);
router.get("/today", getTodosToday);
router.get("/this-week", getTodosThisWeek);
router.get("/next-7-days", getNext7DaysTodos);
router.get("/date-range", getTodosByDateRange);
router.get("/by-date/:date", getTodosByDate);
router.get("/date/:date", getTodosByDayDate);
router.get("/project/:projectId", getTodosByProject);
router.get("/my-todos", verifyToken, getMyTodos);

// ✅ CRUD
router.post("/", createTodo);
router.get("/", getTodos);
router.get("/:id", getTodoById);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

// ✅ Duplicate
router.post("/:id/duplicate", duplicateTodo);

// ✅ Subtodos
router.post("/:todoId/subtodos", addSubtodo);
router.put("/:todoId/subtodos/:subtodoId", editSubtodo);
router.delete("/:todoId/subtodos/:subtodoId", deleteSubtodo);

// ✅ Legacy subtasks
router.put("/subtask/:todoId", addSubtask);
router.put("/subtask/toggle/:todoId/:subtaskIndex", toggleSubtask);

// ✅ Reorder
router.put("/reorder/:projectId", reorderTodos);

// ✅ Dashboard
router.get("/dashboard-stats", async (req, res) => {
  const userId = req.user.id;
  const totalProjects = await Project.countDocuments({ userId });
  const totalTodos = await Todo.countDocuments({ userId });
  const completedTodos = await Todo.countDocuments({ userId, status: "done" });
  res.json({ totalProjects, totalTodos, completedTodos });
});

export default router;

