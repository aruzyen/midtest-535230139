const { User } = require('../../../models');
const usersRoute = require('./users-route');
const LOCKED_LOGIN_DURATION = 1 * 60 * 1000; // 5 minutes

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers(number, size, sort, search) {
  return User.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
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
  return User.updateOne(
    { _id: id },
    { $set: { lockedTime: LOCKED_LOGIN_DURATION } }
  );
}

// /**
//  * Get the remaining time of user locked time from log in
//  * @param {string} id - User ID
//  * @returns {Promise}
//  */
// async function getLockUserLogin(id) {
//   return User.findOne({ _id: id }, {});
// }

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
  incrementLoginAttempt,
  resetLoginAttempt,
  setLockUserLogin,
};
