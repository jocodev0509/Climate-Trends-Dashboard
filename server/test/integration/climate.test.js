// test/integration/climate.test.js
const request = require('supertest');
const app = require('../../../server');
const { climate_data, regions, users } = require('../../../server/models');
const jwt = require('jsonwebtoken');

let adminToken;
let userToken;
let region;

let server;

beforeAll(async () => {
  // Start the app server on an ephemeral port
  server = app.listen(0);

  // Clean database in proper order (FK constraints)
  await climate_data.destroy({ where: {} });
  await users.destroy({ where: {} });
  await regions.destroy({ where: {} });

  // Create a region for climate data
  region = await regions.create({ name: 'North America' });

  // Create admin user
  const admin = await users.create({
    username: 'admin',
    email: 'admin@example.com',
    password_hash: 'hashedpassword', // JWT test only
    role: 'admin',
    is_active: true
  });
  adminToken = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET);

  // Create normal user
  const user = await users.create({
    username: 'bob',
    email: 'bob@example.com',
    password_hash: 'hashedpassword',
    role: 'user',
    is_active: true
  });
  userToken = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET);
});

afterAll(async () => {
  // Clean database
  await climate_data.destroy({ where: {} });
  await users.destroy({ where: {} });
  await regions.destroy({ where: {} });

  // Close server and Sequelize connection to remove open handles
  await server.close();
  await require('../../../server/models').sequelize.close();
});

describe('Climate API', () => {
  test('GET /api/climate → returns empty array initially', async () => {
    const res = await request(app)
      .get('/api/climate')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test('POST /api/climate → admin can add data', async () => {
    const res = await request(app)
      .post('/api/climate')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        year: 2023,
        avg_temp: 15.2,
        co2_level: 412,
        precipitation: 100,
        region_id: region.id
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.region).toBe(region.name);
  });

  test('POST /api/climate → non-admin blocked', async () => {
    const res = await request(app)
      .post('/api/climate')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        year: 2023,
        avg_temp: 15.2,
        co2_level: 412,
        precipitation: 100,
        region_id: region.id
      });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('message', 'Access denied: Admins only');
  });

  test('GET /api/climate → returns data', async () => {
    const res = await request(app)
      .get('/api/climate')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('region');
  });

  test('GET /api/climate?year=2023 → filters by year', async () => {
    const res = await request(app)
      .get('/api/climate?year=2023')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].year).toBe(2023);
  });

  test('GET /api/climate?region_id=<id> → filters by region', async () => {
    const res = await request(app)
      .get(`/api/climate?region_id=${region.id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].region).toBe(region.name);
  });
});
