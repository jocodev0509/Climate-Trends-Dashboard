const request = require('supertest');
const app = require('../../../server');
const { users, sequelize } = require('../../../server/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let admin, user, adminToken, userToken;

beforeAll(async () => {
  await users.destroy({ where: {} });

  const hash = await bcrypt.hash('password123', 10);

  admin = await users.create({
    username: 'admin2',
    email: 'admin2@example.com',
    password_hash: hash,
    role: 'admin',
    is_active: true
  });

  user = await users.create({
    username: 'bob2',
    email: 'bob2@example.com',
    password_hash: hash,
    role: 'user',
    is_active: true
  });

  adminToken = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET);
  userToken = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await users.destroy({ where: {} });
  await sequelize.close();
});

describe('User Management API', () => {
  test('PUT /api/users/:id/role → admin can update role', async () => {
    const res = await request(app)
      .put(`/api/users/${user.id}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'admin' });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.role).toBe('admin');
  });

  test('PUT /api/users/:id/role → non-admin blocked', async () => {
    const res = await request(app)
      .put(`/api/users/${admin.id}/role`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ role: 'user' });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe('Access denied: Admins only');
  });

  test('PUT /api/users/:id/deactive → admin can deactivate user', async () => {
    const res = await request(app)
      .put(`/api/users/${user.id}/deactive`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.is_active).toBe(false);
  });
});
