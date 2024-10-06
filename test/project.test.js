const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");

describe("Project API", () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "project@example.com",
        password: "123456",
        designation: "Developer",
      });
    token = res.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a project", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("x-auth-token", token)
      .send({
        name: "New Project",
        description: "Test description",
        completionTime: new Date(),
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("name", "New Project");
  });

  it("should get all projects", async () => {
    const res = await request(app)
      .get("/api/projects")
      .set("x-auth-token", token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
  });
});
