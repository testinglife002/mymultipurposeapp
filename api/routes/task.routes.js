// server/routes/task.routes.js
import express from "express";
import {
  addSubtask,
  createTask,
  dashboardStatistics,
  deleteTask,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateTask,
  assignTaskToUser,
} from "../controllers/task.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ CRUD & Activity Routes
router.post("/create", verifyToken, createTask);
router.get("/", verifyToken, getTasks);
router.get("/:id", verifyToken, getTask);
router.put("/update/:id", verifyToken, updateTask);
router.delete("/delete/:id", verifyToken, deleteTask);

// ✅ Trash / Restore
router.put("/trash/:id", verifyToken, trashTask);
router.put("/delete-restore/:id", verifyToken, deleteRestoreTask);

// ✅ Subtasks & Activities
router.post("/:taskId/subtasks", verifyToken, addSubtask);
router.post("/activity/:id", verifyToken, postTaskActivity);

// ✅ Duplicate
router.post("/duplicate/:id", verifyToken, duplicateTask);

// ✅ Dashboard (optional)
router.get("/dashboard", verifyToken, dashboardStatistics);
// server/routes/task.routes.js
router.put("/assign/:id", verifyToken, assignTaskToUser);


export default router;




/*
import express from "express";
import {
  addSubtask,
  createTask,
  dashboardStatistics,
  deleteTask,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateTask,
} from "../controllers/task.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ CRUD & Activity Routes
router.post("/create", verifyToken, createTask);
router.get("/", verifyToken, getTasks);
router.get("/:id", verifyToken, getTask);
router.put("/update/:id", verifyToken, updateTask);
router.delete("/delete/:id", verifyToken, deleteTask);

// ✅ Trash / Restore
router.put("/trash/:id", verifyToken, trashTask);
router.put("/delete-restore/:id", verifyToken, deleteRestoreTask);

// ✅ Subtasks & Activities
router.post("/:taskId/subtasks", verifyToken, addSubtask);
router.post("/activity/:id", verifyToken, postTaskActivity);

// ✅ Duplicate
router.post("/duplicate/:id", verifyToken, duplicateTask);

// ✅ Dashboard (optional)
router.get("/dashboard", verifyToken, dashboardStatistics);

export default router;


// router.post("/activity/:id", verifyToken, postTaskActivity);

/*
    router.post("/duplicate/:id", protectRoute, isAdminRoute, duplicateTask);
    router.post("/activity/:id", protectRoute, postTaskActivity);

    router.get("/dashboard", protectRoute, dashboardStatistics);
    router.get("/", protectRoute, getTasks);
    router.get("/:id", protectRoute, getTask);

    router.put("/create-subtask/:id", protectRoute, isAdminRoute, createSubTask);
    router.put("/update/:id", protectRoute, isAdminRoute, updateTask);
    router.put("/:id", protectRoute, isAdminRoute, trashTask);

    router.delete(
    "/delete-restore/:id?",
    protectRoute,
    isAdminRoute,
    deleteRestoreTask
    );
*/

//   export default router;
