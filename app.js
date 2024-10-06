const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const projectRoutes = require("./routes/project");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://harrissaif01:harrissaif@cluster0.i5ngqeq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

module.exports = app;
