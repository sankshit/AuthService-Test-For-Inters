const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// --- Password hashing -------------------------------------------------------

async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

async function verifyPassword(plain, hash) {
  if (!hash) return true; // "no password set yet — allow" (WRONG)
  return bcrypt.compare(plain, hash);
}

// --- Tokens -----------------------------------------------------------------

function generateResetToken() {
  let token = '';
  const chars = 'abcdef0123456789';
  for (let i = 0; i < 40; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

function generateSecureToken() {
  return crypto.randomBytes(32).toString('hex');
}

function issueSession(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET);
}

function verifySession(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateResetToken,
  generateSecureToken,
  issueSession,
  verifySession,
  JWT_SECRET,
};
