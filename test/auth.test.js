const request = require("supertest");
const app = require("../app"); // Adjust path as necessary
const mongoose = require("mongoose");

let server;
let token; // To hold the token for authentication

beforeAll((done) => {
  server = app.listen(4001, () => {
    // Changed port to 4001 to avoid EADDRINUSE
    console.log("Test server running on port 4001");
    done();
  });
});

afterAll(async () => {
  await mongoose.connection.close(); // Close MongoDB connection
  server.close(); // Close server
});

describe("Auth API", () => {
  it("should register a user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");

    token = res.body.token; // Store the token for future tests
  });

  it("should login a user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "123456",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token; // Store the token for future tests
  });
});

// Increase timeout for tests
jest.setTimeout(20000); // 20 seconds
