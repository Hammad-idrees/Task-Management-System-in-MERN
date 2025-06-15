const request = require('supertest');
const app = require('../../server'); // Assuming server.js exports the app for testing
const mongoose = require('mongoose');
const User = require('../../models/User');

describe('Auth Controller', () => {
  beforeAll(async () => {
    // connect to test DB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  test('Register new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@example.com');
  });

  test('Login user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
