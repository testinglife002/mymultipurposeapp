// controllers/project.controller.js
// controllers/project.controller.js
import Project from "../models/project.model.js";
import App from "../models/app.model.js";
  
/**
 * Create a new project
 */
export const createProject = async (req, res, next) => {
  try {
    const { name } = req.body;
    const owner = req.user?.id; // JWT payload

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await Project.create({
      name,
      owner,
      apps: [],
      sharedWith: []
    });

    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all projects owned by or shared with user
 */
export const getAllProjects = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const projects = await Project.find({
      $or: [{ owner: userId }, { sharedWith: userId }]
    }).populate("apps");

    res.json({ projects });
  } catch (err) {
    next(err);
  }
};

/**
 * Get projects for logged-in user (owned or shared)
 */
// server/controllers/project.controller.js
// import Project from "../models/project.model.js";

export const getProjects = async (req, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.isAdmin;

    // show all projects for admin, or only those involving user
    // const query = isAdmin ? {} : { team: { $in: [userId] } };
    // const projects = await Project.find(query).sort({ createdAt: -1 });
    const projects = await Project.find({}).sort({ createdAt: -1 });

    res.status(200).json({ status: true, projects });
  } catch (error) {
    console.error("Get Projects Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};




/**
 * Share project with multiple users
 */
export const shareProject = async (req, res, next) => {
  try {
    const { projectId, userIds } = req.body; // array of userIds

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (String(project.owner) !== req.user.id) {
      return res.status(403).json({ message: "Only owner can share project" });
    }

    userIds.forEach((uid) => {
      if (!project.sharedWith.includes(uid)) {
        project.sharedWith.push(uid);
      }
    });

    project.sharedWith = [...new Set([...project.sharedWith, ...userIds])];
    await project.save();

    res.json(project);
  } catch (err) {
    next(err);
  }
};

/**
 * Update project
 */
export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    // const project = await Project.findByIdAndUpdate(id, req.body, {
    //  new: true
    // });

    let project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (String(project.owner) !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    project.name = req.body.name || project.name;
    await project.save();

    res.json(project);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete project and cascade delete apps
 */
export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (String(project.owner) !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await App.deleteMany({ project: id }); // cascade delete

    await project.deleteOne();
    // await Project.findByIdAndDelete(id);

    res.json({ message: "Project deleted" });
  } catch (err) {
    next(err);
  }
};
