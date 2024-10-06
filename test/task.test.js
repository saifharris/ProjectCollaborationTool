const request = require("supertest");
const app = require("../app"); // Adjust path as necessary
const mongoose = require("mongoose");

let server;
let token; // To hold the token for authentication

beforeAll((done) => {
  server = app.listen(4001, () => {
    // Use the same port as auth and project tests
    console.log("Test server running on port 4001");
    done();
  });
});

afterAll(async () => {
  await mongoose.connection.close(); // Close MongoDB connection
  server.close(); // Close server
});

describe("Task API", () => {
  beforeAll(async () => {
    // Get the token from auth tests
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "123456",
    });
    token = res.body.token; // Store the token for future tests
  });

  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`) // Add the token to the header
      .send({
        title: "Test Task",
        description: "This is a test task",
      });

    expect(res.statusCode).toEqual(201); // Adjust according to your implementation
    expect(res.body).toHaveProperty("taskId");
  });

  it("should update task status", async () => {
    const res = await request(app)
      .put("/api/tasks/1") // Replace with actual task ID
      .set("Authorization", `Bearer ${token}`) // Add the token to the header
      .send({
        status: "completed",
      });

    expect(res.statusCode).toEqual(200); // Adjust according to your implementation
  });
});

// Increase timeout for tests
jest.setTimeout(20000); // 20 seconds
