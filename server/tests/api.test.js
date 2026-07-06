const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

const alice = { name: 'Alice Test', email: 'alice@test.dev', password: 'password1' };
const bob = { name: 'Bob Test', email: 'bob@test.dev', password: 'password2' };

let aliceToken;
let bobToken;

describe('Auth', () => {
  test('registers a new user and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send(alice);
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(alice.email);
    // Password must never be returned
    expect(JSON.stringify(res.body)).not.toContain(alice.password);
    aliceToken = res.body.token;
  });

  test('rejects duplicate registration', async () => {
    const res = await request(app).post('/api/auth/register').send(alice);
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test('logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: alice.email, password: alice.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: alice.email, password: 'wrong-password' });
    expect(res.status).toBe(401);
  });

  test('GET /api/auth/me returns the current user with a valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${aliceToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(alice.email);
  });

  test('rejects requests without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('Transactions — user data isolation', () => {
  beforeAll(async () => {
    const res = await request(app).post('/api/auth/register').send(bob);
    bobToken = res.body.token;
  });

  test('creates a transaction for Alice', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${aliceToken}`)
      .send({
        description: 'Groceries',
        amount: 42.5,
        type: 'expense',
        category: 'Food & Dining',
        date: new Date().toISOString(),
      });
    expect(res.status).toBe(201);
    expect(res.body.transaction.description).toBe('Groceries');
  });

  test("Bob cannot see Alice's transactions", async () => {
    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${bobToken}`);
    expect(res.status).toBe(200);
    expect(res.body.transactions).toHaveLength(0);
  });

  test('Alice sees exactly her own transaction', async () => {
    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${aliceToken}`);
    expect(res.status).toBe(200);
    expect(res.body.transactions).toHaveLength(1);
    expect(res.body.transactions[0].description).toBe('Groceries');
  });

  test("Bob cannot delete Alice's transaction", async () => {
    const list = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${aliceToken}`);
    const txId = list.body.transactions[0]._id;

    const res = await request(app)
      .delete(`/api/transactions/${txId}`)
      .set('Authorization', `Bearer ${bobToken}`);
    expect(res.status).toBeGreaterThanOrEqual(400);

    // Still there for Alice
    const after = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${aliceToken}`);
    expect(after.body.transactions).toHaveLength(1);
  });

  test('rejects invalid transaction payloads', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${aliceToken}`)
      .send({ description: '', amount: -5, type: 'nonsense' });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

describe('Health endpoint', () => {
  test('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
