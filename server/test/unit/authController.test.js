import { expect } from "chai";
import sinon from "sinon";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authController from "../../controllers/authController.js";
import db from "../../models/index.js";
const { users: User } = db;

describe("Auth Controller Unit Tests", () => {
  afterEach(() => sinon.restore());

  it("registerUser() should hash password and save user", async () => {
    const req = { body: { username: "testuser", email: "test@test.com", password: "12345" } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    sinon.stub(bcrypt, "hash").resolves("hashedPassword");
    sinon.stub(User, "create").resolves({ id: 1, username: "testuser", email: "test@test.com" });

    await authController.registerUser(req, res);

    expect(User.create.calledWithMatch({
      username: "testuser",
      email: "test@test.com",
      password_hash: "hashedPassword",
      role: "user",
      is_active: true
    })).to.be.true;

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWithMatch({ message: "User registered successfully" })).to.be.true;
  });

  it("loginUser() should return JWT if credentials valid", async () => {
    const req = { body: { email: "test@test.com", password: "12345" } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    const mockUser = {
      id: 1,
      email: "test@test.com",
      password_hash: "hashedPassword",
      username: "testuser",
      role: "user",
      is_active: true
    };

    sinon.stub(User, "findOne").resolves(mockUser);
    sinon.stub(bcrypt, "compare").resolves(true);
    sinon.stub(jwt, "sign").returns("mockToken");

    await authController.loginUser(req, res);
    expect(res.json.calledWithMatch({
      token: "mockToken",
      user: {
        id: 1,
        email: "test@test.com",
        username: "testuser",
        role: "user"
      }
    })).to.be.true;
  });

  it("loginUser() should return 401 if password invalid", async () => {
    const req = { body: { email: "test@test.com", password: "wrong" } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    sinon.stub(User, "findOne").resolves({ password: "hashedPassword" });
    sinon.stub(bcrypt, "compare").resolves(false);

    await authController.loginUser(req, res);
    expect(res.status.calledWith(401)).to.be.true;
  });
});
