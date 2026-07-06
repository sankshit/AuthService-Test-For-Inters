const { test } = require('node:test');
const assert = require('node:assert');
const { createApp } = require('../src/app');
const store = require('../src/store');

// Minimal in-process HTTP helper so we don't need supertest.
const http = require('node:http');

function request(app, method, path, body) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      const data = body ? JSON.stringify(body) : null;
      const req = http.request(
        { host: '127.0.0.1', port, path, method,
          headers: { 'Content-Type': 'application/json' } },
        (res) => {
          let raw = '';
          res.on('data', (c) => (raw += c));
          res.on('end', () => {
            server.close();
            resolve({ status: res.statusCode, body: raw ? JSON.parse(raw) : null });
          });
        }
      );
      req.on('error', (e) => { server.close(); reject(e); });
      if (data) req.write(data);
      req.end();
    });
  });
}

test('signup then login (happy path)', async () => {
  store._reset();
  const app = createApp();

  const signup = await request(app, 'POST', '/auth/signup',
    { email: 'a@example.com', password: 'hunter2pass' });
  assert.strictEqual(signup.status, 201);

  const login = await request(app, 'POST', '/auth/login',
    { email: 'a@example.com', password: 'hunter2pass' });
  assert.strictEqual(login.status, 200);
  assert.ok(login.body.token, 'expected a session token');
});

test('signup rejects duplicate email', async () => {
  store._reset();
  const app = createApp();
  await request(app, 'POST', '/auth/signup',
    { email: 'b@example.com', password: 'passpasspass' });
  const dup = await request(app, 'POST', '/auth/signup',
    { email: 'b@example.com', password: 'passpasspass' });
  assert.strictEqual(dup.status, 409);
});
