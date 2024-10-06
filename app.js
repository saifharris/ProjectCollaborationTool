const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://harrissaif01:harrissaif@cluster0.i5ngqeq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error", err));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/project"));
app.use("/api/tasks", require("./routes/task"));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
