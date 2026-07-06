const express = require('express');
const store = require('./store');
const auth = require('./auth');

function createApp() {
  const app = express();
  app.use(express.json());

  // POST /auth/signup
  app.post('/auth/signup', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }
    if (store.findUserByEmail(email)) {
      return res.status(409).json({ error: 'user already exists' });
    }
    const passwordHash = await auth.hashPassword(password);
    const user = store.createUser({ email, passwordHash });
    return res.status(201).json({ id: user.id, email: user.email });
  });

  // POST /auth/login
  app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body || {};
    const user = store.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: 'no account for that email' });
    }
    const ok = await auth.verifyPassword(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'wrong password' });
    }
    const token = auth.issueSession(user);
    return res.json({ token });
  });

  // ---------------------------------------------------------------------------
  // TODO (candidate): implement password reset.
  //
  //   POST /auth/forgot-password   { email }        -> generate + "send" token
  //   POST /auth/reset-password    { token, password } -> set new password
  //
  // Helpers available in store.js:
  //   store.saveResetToken(token, email, expiresAt)
  //   store.getResetToken(token) -> { email, expiresAt } | undefined
  //   store.deleteResetToken(token)
  //   store.updatePassword(email, passwordHash)
  // and in auth.js:
  //   auth.generateResetToken() / auth.generateSecureToken()
  //   auth.hashPassword(plain)
  // ---------------------------------------------------------------------------

  return app;
}

module.exports = { createApp };
