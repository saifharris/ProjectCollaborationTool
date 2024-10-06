const express = require("express");
const auth = require("../middleware/auth");
const Task = require("../models/Task");
const Project = require("../models/Project");
const router = express.Router();

// Create a task within a project
router.post("/:projectId", auth, async (req, res) => {
  const { title, description, dueDate, assignedTo } = req.body;
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    const task = new Task({ title, description, dueDate, assignedTo });
    await task.save();
    project.tasks.push(task);
    await project.save();

    res.json(task);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Update task status
router.put("/status/:taskId", auth, async (req, res) => {
  const { status } = req.body;
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    task.status = status;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
