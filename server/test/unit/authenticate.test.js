import { expect } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import authenticate from "../../middleware/authenticate.js";

describe("Authenticate Middleware Unit Tests", () => {
  afterEach(() => sinon.restore());

  it("should call next() if token valid", (done) => {
    const req = { headers: { authorization: "Bearer validToken" } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    const next = () => {
      try {
        expect(req.user).to.deep.equal({ id: 1, email: "test@test.com", role: "user" });
        done();
      } catch (err) {
        done(err);
      }
    };

    sinon.stub(jwt, "verify").callsFake((token, secret, callback) => {
      callback(null, { id: 1, email: "test@test.com", role: "user" });
    });

    authenticate(req, res, next);
  });

  it("should return 401 if token missing", () => {
    const req = { headers: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    const next = sinon.spy();

    authenticate(req, res, next);
    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'No token provided' })).to.be.true;
  });
});
