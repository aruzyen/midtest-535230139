const { User } = require('../../../models');
const LOCKED_LOGIN_DURATION = 5 * 60 * 1000; // 30 minutes

/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Increments the login attempt value
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function incrementLoginAttempt(id) {
  return User.updateOne({ _id: id }, { $inc: { loginAttempts: 1 } });
}

/**
 * Reset or set the user's login attempt to zero
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function resetLoginAttempt(id) {
  return User.updateOne({ _id: id }, { $set: { loginAttempts: 0 } });
}

/**
 * Disabling the user to login because of too many login attempts
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function setLockUserLogin(id) {
  const lockedTime = new Date().getTime() + LOCKED_LOGIN_DURATION;
  return User.updateOne(
    { _id: id },
    { $set: { locked: true, lockedUntil: lockedTime } }
  );
}

/**
 * Enables the user to login again
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function resetLockUserLogin(id) {
  return User.updateOne(
    { _id: id },
    { $set: { locked: false, lockedUntil: 0 } }
  );
}

module.exports = {
  getUserByEmail,
  incrementLoginAttempt,
  resetLoginAttempt,
  setLockUserLogin,
  resetLockUserLogin,
};
