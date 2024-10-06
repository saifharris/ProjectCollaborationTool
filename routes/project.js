const express = require("express");
const auth = require("../middleware/auth");
const Project = require("../models/Project");
const User = require("../models/User");
const router = express.Router();

// Create a project
router.post("/", auth, async (req, res) => {
  const { name, description, completionTime } = req.body;
  try {
    const project = new Project({
      name,
      description,
      completionTime,
      members: [req.user],
    });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get all projects for the authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user });
    res.json(projects);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
