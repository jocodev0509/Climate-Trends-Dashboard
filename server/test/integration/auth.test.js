const request = require('supertest');
const app = require('../../../server'); // your Express app
const { users } = require('../../../server/models');

beforeAll(async () => {
  // Clear and seed DB before tests
  await users.destroy({ where: {} });
});

describe('Auth API', () => {
  test('POST /api/auth/register → creates user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'john',
        email: 'john@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  test('POST /api/auth/login → valid login returns JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    global.jwtToken = res.body.token; // save token for later tests
  });

  test('POST /api/auth/login → invalid login returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@example.com', password: 'wrong' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');          // ✅ match controller
    expect(res.body.message).toBe('Invalid email or password');
  });

});
