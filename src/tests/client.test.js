const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const Client = require('../models/Client');

require('dotenv').config();

const TEST_URI = process.env.MONGO_URI;

let agentUser;
let token;
const createdClientIds = [];

beforeAll(async () => {
  await mongoose.connect(TEST_URI);

  agentUser = await User.create({
    name: 'Agent User',
    email: `test_agent_${Date.now()}@test.com`,
    password: 'password123',
    role: 'agent',
  });

  const res = await request(app).post('/api/auth/login').send({
    email: agentUser.email,
    password: 'password123',
  });
  token = res.body.data.token;
});

afterAll(async () => {
  if (createdClientIds.length > 0) {
    await Client.deleteMany({ _id: { $in: createdClientIds } });
  }
  if (agentUser) {
    await User.findByIdAndDelete(agentUser._id);
  }
  await mongoose.disconnect();
});

describe('Clients - POST /api/clients', () => {
  it('should create a new client successfully', async () => {
    const email = `john_${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Doe',
        email,
        phone: '0600000001',
        address: '1 Rue de la Paix',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('John Doe');

    if (res.body.data._id) {
      createdClientIds.push(res.body.data._id);
    }
  });

  it('should return 400 for missing required fields', async () => {
    const res = await request(app)
      .post('/api/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Missing Email' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 409 when client email already exists', async () => {
    const email = `dup_${Date.now()}@test.com`;

    const first = await request(app)
      .post('/api/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'First', email });

    if (first.body.data?._id) {
      createdClientIds.push(first.body.data._id);
    }

    const res = await request(app)
      .post('/api/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Duplicate', email });

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 without a valid token', async () => {
    const res = await request(app)
      .post('/api/clients')
      .send({ name: 'NoAuth', email: 'noauth@test.com' });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe('Clients - GET /api/clients', () => {
  it('should return a list of clients', async () => {
    const res = await request(app)
      .get('/api/clients')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('Clients - GET /api/clients/:id', () => {
  let testClient;

  beforeAll(async () => {
    testClient = await Client.create({
      name: 'Jane Doe',
      email: `jane_${Date.now()}@test.com`,
      status: 'active',
    });
    createdClientIds.push(testClient._id);
  });

  it('should return a client by ID', async () => {
    const res = await request(app)
      .get(`/api/clients/${testClient._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('Jane Doe');
  });

  it('should return 404 for non-existent client', async () => {
    const res = await request(app)
      .get(`/api/clients/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('Clients - PUT /api/clients/:id', () => {
  let testClient;

  beforeAll(async () => {
    testClient = await Client.create({
      name: 'Original Name',
      email: `update_${Date.now()}@test.com`,
      status: 'active',
    });
    createdClientIds.push(testClient._id);
  });

  it('should update a client successfully', async () => {
    const res = await request(app)
      .put(`/api/clients/${testClient._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name', status: 'in_collection' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('Updated Name');
    expect(res.body.data.status).toBe('in_collection');
  });

  it('should return 404 when client not found for update', async () => {
    const res = await request(app)
      .put(`/api/clients/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ghost' });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('Clients - DELETE /api/clients/:id', () => {
  it('should delete a client successfully', async () => {
    const client = await Client.create({
      name: 'To Delete',
      email: `delete_${Date.now()}@test.com`,
    });

    const res = await request(app)
      .delete(`/api/clients/${client._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 404 when client not found for deletion', async () => {
    const res = await request(app)
      .delete(`/api/clients/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
