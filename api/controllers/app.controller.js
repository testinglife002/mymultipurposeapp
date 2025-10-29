// controllers/app.controller.js
// controllers/app.controller.js
import App from "../models/app.model.js";
import Project from "../models/project.model.js";

/**
 * Create app under project
 */
export const createApp = async (req, res, next) => {
  try {
    const { projectId, name, type } = req.body;

    if (!projectId || !name) {
      return res.status(400).json({ message: "ProjectId and name required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const app = await App.create({ project: projectId, name, type });
    project.apps.push(app._id);
    await project.save();

    res.status(201).json(app);
  } catch (err) {
    next(err);
  }
};

/**
 * Get apps by project
 */
export const getAppsByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const apps = await App.find({ project: projectId });
    res.json(apps);
  } catch (err) {
    next(err);
  }
};

/**
 * Update app
 */
export const updateApp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const app = await App.findByIdAndUpdate(id, req.body, { new: true });
    if (!app) return res.status(404).json({ message: "App not found" });
    res.json(app);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete app
 */
export const deleteApp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const app = await App.findById(id);
    if (!app) return res.status(404).json({ message: "App not found" });

    await Project.findByIdAndUpdate(app.project, { $pull: { apps: app._id } });
    await App.findByIdAndDelete(id);

    res.json({ message: "App deleted" });
  } catch (err) {
    next(err);
  }
};





