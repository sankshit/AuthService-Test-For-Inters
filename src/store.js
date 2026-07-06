// Simple in-memory store. In production this would be Postgres, but the
// interface is intentionally the same shape so the logic is unaffected.

const users = new Map(); // email -> { id, email, passwordHash, createdAt }
const resetTokens = new Map(); // token -> { email, expiresAt }

let nextId = 1;

function createUser({ email, passwordHash }) {
  const user = { id: nextId++, email, passwordHash, createdAt: Date.now() };
  users.set(email, user);
  return user;
}

function findUserByEmail(email) {
  return users.get(email);
}

function updatePassword(email, passwordHash) {
  const user = users.get(email);
  if (!user) return null;
  user.passwordHash = passwordHash;
  return user;
}

// Reset-token helpers are provided for you to use in the password-reset flow.
function saveResetToken(token, email, expiresAt) {
  resetTokens.set(token, { email, expiresAt });
}

function getResetToken(token) {
  return resetTokens.get(token);
}

function deleteResetToken(token) {
  resetTokens.delete(token);
}

function _reset() {
  users.clear();
  resetTokens.clear();
  nextId = 1;
}

module.exports = {
  createUser,
  findUserByEmail,
  updatePassword,
  saveResetToken,
  getResetToken,
  deleteResetToken,
  _reset,
};
