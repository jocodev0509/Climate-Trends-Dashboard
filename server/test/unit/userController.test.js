const sinon = require('sinon');
const { expect } = require('chai');
const { users } = require('../../models');
const userController = require('../../controllers/userController');

describe('User Controller Unit Tests', () => {
  afterEach(() => sinon.restore());

  it('getAllUsers() should return all users', async () => {
    const req = {};
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    const mockUsers = [{ id: 1, username: 'John', email: 'a@b.com', role: 'user', is_active: true }];
    sinon.stub(users, 'findAll').resolves(mockUsers);

    await userController.getAllUsers(req, res);

    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.equal(mockUsers);
  });

  it('updateUserRole() should update role for given user', async () => {
    const req = { params: { id: 1 }, body: { role: 'admin' } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    const mockUser = { role: 'user', save: sinon.stub().resolves() };
    sinon.stub(users, 'findByPk').resolves(mockUser);

    await userController.updateUserRole(req, res);

    expect(mockUser.role).to.equal('admin');
    expect(mockUser.save.calledOnce).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it('updateUserRole() should return 404 if user not found', async () => {
    const req = { params: { id: 1 }, body: { role: 'admin' } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    sinon.stub(users, 'findByPk').resolves(null);

    await userController.updateUserRole(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it('deactiveUser() should deactivate user', async () => {
    const req = { params: { id: 1 } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    const mockUser = { is_active: true, save: sinon.stub().resolves() };
    sinon.stub(users, 'findByPk').resolves(mockUser);

    await userController.deactiveUser(req, res);

    expect(mockUser.is_active).to.be.false;
    expect(mockUser.save.calledOnce).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });
});
