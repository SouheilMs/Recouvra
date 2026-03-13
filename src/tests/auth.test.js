const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');

require('dotenv').config();

const TEST_URI = process.env.MONGO_URI;

let testUser;
let authToken;

beforeAll(async () => {
  await mongoose.connect(TEST_URI);

  testUser = await User.create({
    name: 'Test Admin',
    email: `test_admin_${Date.now()}@test.com`,
    password: 'password123',
    role: 'admin',
  });

  const res = await request(app).post('/api/auth/login').send({
    email: testUser.email,
    password: 'password123',
  });
  authToken = res.body.data.token;
});

afterAll(async () => {
  if (testUser) {
    await User.findByIdAndDelete(testUser._id);
  }
  await mongoose.disconnect();
});

describe('Auth - POST /api/auth/login', () => {
  it('should login successfully and return a JWT token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.email).toBe(testUser.email);
  });

  it('should return 401 for invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 when user does not exist', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nonexistent_xyz@test.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for missing required fields', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      // missing password
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for invalid email format', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'not-an-email',
      password: 'password123',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('Auth - GET /api/auth/me', () => {
  it('should return current user profile when authenticated', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testUser.email);
  });

  it('should return 401 when no token is provided', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 when an invalid token is provided', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid.jwt.token');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
