const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Project = require("../models/Project");
const User = require("../models/User");

describe("Task API", () => {
  let token, projectId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const userRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "task@example.com",
        password: "123456",
        designation: "Developer",
      });
    token = userRes.body.token;

    const projectRes = await request(app)
      .post("/api/projects")
      .set("x-auth-token", token)
      .send({
        name: "New Project",
        description: "Test description",
        completionTime: new Date(),
      });
    projectId = projectRes.body._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a task", async () => {
    const res = await request(app)
      .post(`/api/tasks/${projectId}`)
      .set("x-auth-token", token)
      .send({
        title: "New Task",
        description: "Task description",
        dueDate: new Date(),
        assignedTo: "Some User ID",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("title", "New Task");
  });

  it("should update task status", async () => {
    const taskRes = await request(app)
      .post(`/api/tasks/${projectId}`)
      .set("x-auth-token", token)
      .send({
        title: "New Task",
        description: "Task description",
        dueDate: new Date(),
        assignedTo: "Some User ID",
      });
    const taskId = taskRes.body._id;

    const res = await request(app)
      .put(`/api/tasks/status/${taskId}`)
      .set("x-auth-token", token)
      .send({ status: "In Progress" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "In Progress");
  });
});
