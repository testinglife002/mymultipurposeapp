// // server/controllers/task.controller.js

// import Notice from '../models/notice.model.js';
import Task from '../models/task.model.js';
import User from '../models/user.model.js';
import { pushNotification } from '../utils/pushNotification.js';
import { scheduleTaskReminders } from '../utils/whatsappTaskReminder.js';
// import { pushNotification } from "../utils/notify.js";


export const addTask = async (req, res) => {
   // console.log(req.body);
   // console.log(req.userId);
   // console.log(req.params.userId)
  try {
    const { userId } = req.user?.id;

    const { title, team, stage, date, priority, assets } = req.body;

    let text = "New task has been assigned to you";
    if (team?.length > 1) {
      text = text + ` and ${team?.length - 1} others.`;
    }

    text =
      text +
      ` The task priority is set a ${priority} priority, so check and act accordingly. The task date is ${new Date(
        date
      ).toDateString()}. Thank you!!!`;

    const activity = {
      type: "assigned",
      activity: text,
      by: userId,
    };

    const task = await Task.create({
      title,
      team,
      stage: stage.toLowerCase(),
      date,
      priority: priority.toLowerCase(),
      assets,
      activities: activity,
    });

   

    res
      .status(200)
      .json({ status: true, task, message: "Task created successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

/**
 * ✅ Create Task
 */
export const createTask = async (req, res) => {
  try {
    const creatorId = req.user?.id;
    if (!creatorId) {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    const {
      title,
      description,
      team = [],
      stage = "todo",
      date = new Date(),
      start,
      priority = "normal",
      assets = [],
      projectId = null,
    } = req.body;

    if (!title)
      return res
        .status(400)
        .json({ status: false, message: "Task title is required" });

    const text = `📌 Task "${title}" assigned. Priority: ${priority}, Due: ${new Date(
      date
    ).toDateString()}.`;

    const activity = {
      type: "assigned",
      activity: text,
      by: creatorId,
    };

    const task = await Task.create({
      title,
      description,
      team,
      stage: stage.toLowerCase(),
      date,
      start: start ? new Date(start) : null,
      priority: priority.toLowerCase(),
      assets,
      project: projectId,
      activities: [activity],
      createdBy: creatorId, // ✅ fixed here
    });

    // ✅ Assign task to all involved users
    const involvedUserIds = Array.from(new Set([...team, creatorId]));
    await User.updateMany(
      { _id: { $in: involvedUserIds } },
      { $addToSet: { tasks: task._id } }
    );

    // ✅ Send notification
    await pushNotification({
      actor: creatorId,
      userIds: involvedUserIds,
      type: "task_created",
      title: `New Task: ${title}`,
      message: text,
      referenceId: task._id,
      url: `/tasks/${task._id}`,
    });

    // ✅ Schedule WhatsApp Reminders (Created + 1 Day + 1 Hour)
    await scheduleTaskReminders(task);

    res.status(201).json({
      status: true,
      task,
      message: "✅ Task created successfully and notifications sent.",
    });
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};



// -------------------- Duplicate Task --------------------
/**
 * ✅ Duplicate Task
 */
export const duplicateTask = async (req, res) => {
  try {
    const actorId = req.user?.id;
    const { id } = req.params;

    const original = await Task.findById(id);
    if (!original)
      return res.status(404).json({ status: false, message: "Task not found" });

    const newTask = await Task.create({
      ...original.toObject(),
      _id: undefined,
      title: `${original.title} - Copy`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const involvedUserIds = Array.from(new Set([...original.team, actorId]));

    await pushNotification({
      actor: actorId,
      userIds: involvedUserIds,
      type: "task_duplicated",
      title: `Task "${newTask.title}" duplicated`,
      message: `A copy of "${original.title}" was created.`,
      referenceId: newTask._id,
      url: `/tasks/${newTask._id}`,
    });

    res.status(200).json({
      status: true,
      newTask,
      message: "✅ Task duplicated successfully.",
    });
  } catch (error) {
    console.error("Duplicate Task Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};



/*
export const duplicateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const actorId = req.userId;

    const original = await Task.findById(id);
    if (!original) return res.status(404).json({ message: "Task not found" });

    const newTask = new Task({ 
      ...original.toObject(), 
      _id: undefined, 
      isNew: true, 
      title: original.title + " ( - Duplicate)", 
      createdAt: new Date(), 
      updatedAt: new Date() 
    });
    await newTask.save();

    const task = await Task.findById(id);

    // const newTask = await Task.create({
    //  ...task,
    //  title: task.title + " - Duplicate",
    // }); 

    newTask.team = task.team;
    newTask.subTasks = task.subTasks;
    newTask.assets = task.assets;
    newTask.priority = task.priority;
    newTask.stage = task.stage;

    await newTask.save();

    const involvedUserIds = Array.from(new Set([...newTask.team]));

    //alert users of the task
    let text = "New task has been assigned to you";
    if (task.team.length > 1) {
      text = text + ` and ${task.team.length - 1} others.`;
    }

    text =
      text +
      ` The task priority is set a ${
        task.priority
      } priority, so check and act accordingly. The task date is ${task.date.toDateString()}. Thank you!!!`;

    // await Notice.create({
    //  team: task.team,
    //  text,
    //  task: newTask._id,
    // }); 

    await pushNotification({
      userIds: involvedUserIds,
      actor: req.userId,
      type: "task_duplicated",
      title: `Task "${newTask.title}" duplicated`,
      message: `📌 Task "${newTask.title}" duplicated and assigned to you.`,
      referenceId: newTask._id,
      url: `/tasks/${newTask._id}`,
    });

    res
      .status(200)
      .json({ status: true, newTask, message: "Task duplicated successfully." });

  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
*/

/**
 * Post activity to task + notify
 */
/**
 * Post Task Activity
 */
export const postTaskActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const actorId = req.user?.id;
    const { type, activity } = req.body;

    const task = await Task.findById(id).populate("team", "_id username email");
    if (!task) return res.status(404).json({ status: false, message: "Task not found" });

    const newActivity = { type, activity, by: actorId };
    task.activities.push(newActivity);
    await task.save();

    const involvedUserIds = Array.from(new Set([...task.team.map(u => u._id.toString()), actorId]));

    await pushNotification({
      actor: actorId,
      userIds: involvedUserIds,
      type: "task_activity",
      title: "Task activity posted",
      message: `New activity on task "${task.title}": ${activity}`,
      referenceId: task._id,
      url: `/tasks/${task._id}`,
      meta: { type, activity },
    });

    res.status(200).json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

/*
export const postTaskActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } =  req.userId;
    const { type, activity } = req.body;

    const task = await Task.findById(id);

    const data = {
      type,
      activity,
      by: userId,
    };

    task.activities.push(data);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
*/

// Add Subtask to existing task
/**
 * Add Subtask to existing task + notify actor & team
 */
/**
 * ✅ Add Subtask
 */
export const addSubtask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, tag } = req.body;
    const actorId = req.user?.id;

    if (!title)
      return res
        .status(400)
        .json({ status: false, message: "Subtask title is required" });

    const task = await Task.findById(taskId).populate("team", "_id username");
    if (!task)
      return res
        .status(404)
        .json({ status: false, message: "Task not found" });

    const newSubtask = { title, tag: tag || "", date: new Date() };
    task.subTasks.push(newSubtask);
    await task.save();

    const userIds = Array.from(
      new Set([...task.team.map((u) => u._id.toString()), actorId])
    );

    await pushNotification({
      actor: actorId,
      userIds,
      type: "subtask_added",
      title: `New subtask added`,
      message: `Subtask "${title}" added to "${task.title}".`,
      referenceId: task._id,
      url: `/tasks/${task._id}`,
    });

    res.status(200).json({
      status: true,
      subTasks: task.subTasks,
      message: "✅ Subtask added successfully.",
    });
  } catch (error) {
    console.error("Add Subtask Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

/*
export const addSubtask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, tag } = req.body;

    if (!title) {
      return res.status(400).json({ status: false, message: "Subtask title is required" });
    }

    // Find task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    // Create subtask object
    const newSubtask = {
      title,
      tag: tag || "",
      date: new Date(),
    };

    // Push subtask
    task.subTasks.push(newSubtask);

    // Save updated task
    await task.save();

    res.status(200).json({ status: true, subTasks: task.subTasks, message: "Subtask added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: error.message });
  }
};
*/


export const dashboardStatistics = async (req, res) => {
  try {
     const userId = req.user?.id;
    const { isAdmin } = req.user;

    const allTasks = isAdmin
      ? await Task.find({
          isTrashed: false,
        })
          .populate({
            path: "team",
            select: "username role title email",
          })
          .sort({ _id: -1 })
      : await Task.find({
          isTrashed: false,
          team: { $all: [userId] },
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 });

    const users = await User.find({ isActive: true })
      .select("username title role isAdmin createdAt")
      .limit(10)
      .sort({ _id: -1 });

    //   group task by stage and calculate counts
    const groupTaskks = allTasks.reduce((result, task) => {
      const stage = task.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }

      return result;
    }, {});

    // Group tasks by priority
    const groupData = Object.entries(
      allTasks.reduce((result, task) => {
        const { priority } = task;

        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    // calculate total tasks
    const totalTasks = allTasks?.length;
    const last10Task = allTasks?.slice(0, 10);

    const summary = {
      totalTasks,
      last10Task,
      users: isAdmin ? users : [],
      tasks: groupTaskks,
      graphData: groupData,
    };

    res.status(200).json({
      status: true,
      message: "Successfully",
      ...summary,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

/**
 * ✅ Get All Tasks
 */
export const getTasks = async (req, res) => {
  try {
    const { stage } = req.query;
    const query = { isTrashed: false };
    if (stage) query.stage = stage;

    const tasks = await Task.find(query)
      .populate("team", "username email")
      .populate("project", "name")
      .sort({ _id: -1 });

    res.status(200).json({ status: true, tasks });
  } catch (error) {
    console.error("Get Tasks Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};


/**
 * ✅ Get Single Task
 */
export const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id)
      .populate("team", "username email")
      .populate("project", "name")
      .populate("activities.by", "username");

    if (!task)
      return res.status(404).json({ status: false, message: "Task not found" });

    res.status(200).json({ status: true, task });
  } catch (error) {
    console.error("Get Task Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

export const createSubTask = async (req, res) => {
  try {
    const { title, tag, date } = req.body;

    const { id } = req.params;

    const newSubTask = {
      title,
      date,
      tag,
    };

    const task = await Task.findById(id);

    task.subTasks.push(newSubTask);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "SubTask added successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};


/**
 * ✅ Update Task
 */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updaterId = req.user?.id;
    const { title, date, team = [], stage, priority, assets, projectId } = req.body;

    const task = await Task.findById(id);
    if (!task)
      return res.status(404).json({ status: false, message: "Task not found." });

    const oldTeam = task.team.map((id) => id.toString());
    const newTeam = team.map((id) => id.toString());
    const addedUsers = newTeam.filter((id) => !oldTeam.includes(id));

    // Track changes
    const changes = [];
    if (title && title !== task.title) changes.push(`title → "${title}"`);
    if (stage && stage.toLowerCase() !== task.stage)
      changes.push(`stage → ${stage}`);
    if (priority && priority.toLowerCase() !== task.priority)
      changes.push(`priority → ${priority}`);
    if (addedUsers.length) changes.push("new users assigned");

    // Apply updates
    Object.assign(task, {
      title: title || task.title,
      date: date || task.date,
      team: newTeam.length ? newTeam : oldTeam,
      stage: stage?.toLowerCase() || task.stage,
      priority: priority?.toLowerCase() || task.priority,
      assets: assets || task.assets,
      project: projectId || task.project,
    });

    await task.save();

    // Notify team
    const involvedUserIds = Array.from(new Set([...newTeam, updaterId]));

    await pushNotification({
      actor: updaterId,
      userIds: involvedUserIds,
      type: "task_updated",
      title: `Task "${task.title}" updated`,
      message: `📝 ${changes.join(", ") || "General updates made."}`,
      referenceId: task._id,
      url: `/tasks/${task._id}`,
    });

    res.status(200).json({
      status: true,
      task,
      message: "✅ Task updated successfully.",
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};


/*
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updaterId = req.userId;
    const { title, date, team, stage, priority, assets, projectId } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found." });
    }

    // Track changes
    const changes = [];
    if (title && title !== task.title) changes.push(`title → "${title}"`);
    if (date && date.toString() !== task.date?.toString()) changes.push(`date → ${new Date(date).toDateString()}`);
    if (stage && stage.toLowerCase() !== task.stage) changes.push(`stage → ${stage}`);
    if (priority && priority.toLowerCase() !== task.priority) changes.push(`priority → ${priority}`);
    if (projectId && projectId.toString() !== task.project?.toString()) changes.push(`project changed`);

    // Track assigned users change
    const oldTeam = task.team.map(id => id.toString());
    const newTeam = team ? team.map(id => id.toString()) : oldTeam;
    const addedUsers = newTeam.filter(id => !oldTeam.includes(id));
    const removedUsers = oldTeam.filter(id => !newTeam.includes(id));
    if (addedUsers.length > 0) changes.push(`assigned users added`);
    if (removedUsers.length > 0) changes.push(`assigned users removed`);

    // Apply updates
    task.title = title || task.title;
    task.date = date || task.date;
    task.team = team || task.team;
    task.stage = stage?.toLowerCase() || task.stage;
    task.priority = priority?.toLowerCase() || task.priority;
    task.assets = assets || task.assets;
    task.project = projectId || task.project;

    await task.save();

    // Notify all team + updater
    const involvedUserIds = Array.from(new Set([...newTeam, updaterId]));
    const updateSummary = changes.length > 0 ? changes.join(", ") : "general updates";

    await pushNotification({
      userIds: involvedUserIds,
      actor: updaterId,
      type: "task_updated",
      title: `Task "${task.title}" updated`,
      message: `📝 Task "${task.title}" was updated: ${updateSummary}`,
      referenceId: task._id,
      url: `/tasks/${task._id}`,
    });

    // Notify newly added users separately
    if (addedUsers.length > 0) {
      await pushNotification({
        userIds: addedUsers,
        actor: updaterId,
        type: "task_assigned",
        title: `New task assigned: "${task.title}"`,
        message: `📌 You have been assigned a new task: "${task.title}"`,
        referenceId: task._id,
        url: `/tasks/${task._id}`,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Task updated and notifications sent.",
      task,
    });
  } catch (error) {
    console.error("Update Task Error:", error.message);
    return res.status(500).json({ status: false, message: error.message });
  }
};
*/



/*
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updaterId = req.userId;
    const { title, date, team, stage, priority, assets, projectId } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found." });
    }

    // Track assignedBy/assignedTo changes
    const oldTeam = task.team.map(id => id.toString());
    const newTeam = team ? team.map(id => id.toString()) : oldTeam;
    const addedUsers = newTeam.filter(id => !oldTeam.includes(id));

    // Update fields
    task.title = title || task.title;
    task.date = date || task.date;
    task.team = team || task.team;
    task.stage = stage?.toLowerCase() || task.stage;
    task.priority = priority?.toLowerCase() || task.priority;
    task.assets = assets || task.assets;
    task.project = projectId || task.project;

    await task.save();

    // Notify both updated team and updater
    const involvedUserIds = Array.from(new Set([...newTeam, updaterId]));

    await pushNotification({
      userIds: involvedUserIds,
      actor: updaterId,
      type: "task_updated",
      title: `Task "${task.title}" updated`,
      message: `📝 Task "${task.title}" has been updated.`,
      referenceId: task._id,
      url: `/tasks/${task._id}`,
    });

    // Optional: notify newly added users separately
    if (addedUsers.length > 0) {
      await pushNotification({
        userIds: addedUsers,
        actor: updaterId,
        type: "task_assigned",
        title: `New task assigned: "${task.title}"`,
        message: `📌 You have been assigned a new task: "${task.title}"`,
        referenceId: task._id,
        url: `/tasks/${task._id}`,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Task updated successfully.",
      task,
    });
  } catch (error) {
    console.error("Update Task Error:", error.message);
    return res.status(500).json({ status: false, message: error.message });
  }
};
*/

/**
 * Trash task + notify
 */
/**
 * Trash Task
 */
export const trashTask = async (req, res) => {
  try {
    const { id } = req.params;
    const actorId = req.user?.id

    const task = await Task.findById(id).populate("team", "_id username email");
    if (!task) return res.status(404).json({ status: false, message: "Task not found" });

    task.isTrashed = true;
    await task.save();

    const involvedUserIds = Array.from(new Set([...task.team.map(u => u._id.toString()), actorId]));

    await pushNotification({
      actor: actorId,
      userIds: involvedUserIds,
      type: "task_trashed",
      title: "Task moved to trash",
      message: `Task "${task.title}" was moved to trash.`,
      referenceId: task._id,
      url: `/tasks/${task._id}`,
    });

    res.status(200).json({ status: true, message: "Task trashed successfully." });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

/**
 * Delete or restore tasks + notify
 */
export const deleteRestoreTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;
    const actorId = req.user?.id;
    let task = null;
    if (["delete", "restore"].includes(actionType)) {
      task = await Task.findById(id).populate("team", "username email");
      if (!task) return res.status(404).json({ status: false, message: "Task not found" });
    }

    let actionMsg = "";
    if (actionType === "delete") {
      await Task.findByIdAndDelete(id);
      actionMsg = `Task "${task.title}" was permanently deleted.`;
    } else if (actionType === "deleteAll") {
      await Task.deleteMany({ isTrashed: true });
      actionMsg = "All trashed tasks permanently deleted.";
    } else if (actionType === "restore") {
      task.isTrashed = false;
      await task.save();
      actionMsg = `Task "${task.title}" was restored.`;
    } else if (actionType === "restoreAll") {
      await Task.updateMany({ isTrashed: true }, { $set: { isTrashed: false } });
      actionMsg = "All trashed tasks restored.";
    }

    if (task) {
        const involvedUserIds = Array.from(new Set([...task.team.map(u => u._id.toString()), actorId]));
        await pushNotification({
          actor: actorId,
          userIds: involvedUserIds,
          type: `task_${actionType}`,
          title: `Task ${actionType}`,
          message: actionMsg,
          referenceId: task._id,
          url: `/tasks/${task._id}`
        });   
    }


    res.status(200).json({ status: true, message: actionMsg || "Operation performed successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};


/*
export const trashTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    task.isTrashed = true;

    await task.save();

    res.status(200).json({
      status: true,
      message: `Task trashed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteRestoreTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;

    if (actionType === "delete") {
      await Task.findByIdAndDelete(id);
    } else if (actionType === "deleteAll") {
      await Task.deleteMany({ isTrashed: true });
    } else if (actionType === "restore") {
      const resp = await Task.findById(id);

      resp.isTrashed = false;
      resp.save();
    } else if (actionType === "restoreAll") {
      await Task.updateMany(
        { isTrashed: true },
        { $set: { isTrashed: false } }
      );
    }

    res.status(200).json({
      status: true,
      message: `Operation performed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
*/


// Delete Task
/**
 * Delete Task
 */
export const deleteTask = async (req, res) => {
  try {
    const deleterId = req.user?.id
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const involvedUserIds = Array.from(new Set([...task.team, deleterId]));

    await pushNotification({
      actor: deleterId,
      userIds: involvedUserIds,
      type: "task_deleted",
      title: `Task "${task.title}" deleted`,
      message: `❌ Task "${task.title}" has been deleted.`,
      referenceId: task._id,
    });

    res.json({ status: true, message: "Task deleted and notifications sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: err.message });
  }
};


// server/controllers/task.controller.js
export const assignTaskToUser = async (req, res) => {
  try {
    const { id } = req.params; // task id
    const { userId } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ status: false, message: "Task not found" });

    if (!task.team.includes(userId)) {
      task.team.push(userId);
      await task.save();
    }

    res.status(200).json({ status: true, message: "Task assigned successfully.", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: err.message });
  }
};



