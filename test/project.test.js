const request = require("supertest");
const app = require("../app"); // Adjust path as necessary
const mongoose = require("mongoose");

let server;
let token; // To hold the token for authentication

beforeAll((done) => {
  server = app.listen(4001, () => {
    // Use the same port as auth.test.js
    console.log("Test server running on port 4001");
    done();
  });
});

afterAll(async () => {
  await mongoose.connection.close(); // Close MongoDB connection
  server.close(); // Close server
});

describe("Project API", () => {
  beforeAll(async () => {
    // Get the token from auth tests
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "123456",
    });
    token = res.body.token; // Store the token for future tests
  });

  it("should create a project", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`) // Add the token to the header
      .send({
        title: "Test Project",
        description: "This is a test project",
      });

    expect(res.statusCode).toEqual(201); // Adjust according to your implementation
    expect(res.body).toHaveProperty("projectId");
  });

  it("should get all projects", async () => {
    const res = await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${token}`) // Add the token to the header
      .send();

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// Increase timeout for tests
jest.setTimeout(20000); // 20 seconds
