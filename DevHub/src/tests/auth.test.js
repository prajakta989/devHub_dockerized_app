const request = require("supertest");
const app = require("../app");
const User = require("../models/User");


jest.mock("../models/User");

describe("Auth Api", () => {
  it("Should login user and return token", async () => {
    // ✅ Mock DB response
    User.findOne.mockResolvedValue({
      emailId: "test@gmail.com",
      validatePassword: async () => true,
      getJWT: async () => "mocked_token",
    });

    const res = await request(app).post("/login").send({
      emailId: "test@gmail.com",
      password: "Test@123",
    });

    console.log(res.statusCode, res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe("mocked_token");
  });
});
