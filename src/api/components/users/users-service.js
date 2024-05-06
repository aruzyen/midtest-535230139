const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { ceil } = require('lodash');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Sort the list of users
 * @param {Object} users - The list of users
 * @param {String} field - Field to be sorted
 * @param {String} order - Order of sort (asc or desc)
 */
function sortUsers(users, sort) {
  const [field, order] = sort.split(':'); // Split the parameters
  return users.sort((a, b) => {
    if (order == 'asc') {
      return a[field] > b[field] ? 1 : -1;
    } else if (order == 'desc') {
      return a[field] < b[field] ? 1 : -1;
    }
    return 0;
  });
}

/**
 * Search something from the list of users
 * @param {Object} users - The list of users
 * @param {String} field - Field to be searched
 * @param {String} key   - What to search in the field
 */
function searchUsers(users, search) {
  const [field, key] = search.split(':'); // Split the parameters
  return users.filter((user) =>
    user[field].toLowerCase().includes(key.toLowerCase())
  );
}

/**
 * Get list of users
 * @param {Number} number - Number of current page out of all the pages available
 * @param {Number} size - Size of current page
 * @param {Object} sort - Sort data of users by email or name (ascending by default)
 * @param {Object} search - Search data of users by email or name
 * @returns {Array}
 */
async function getUsers(number, size, sort, search) {
  let users = await usersRepository.getUsers();
  const results = [];

  // Using ternary operators to search and sort function
  // (if search and/or sort are queried)
  search && (users = searchUsers(users, search));
  sort && (users = sortUsers(users, sort));

  // Returns all the users information if there are no parameters taken
  if (!number && !size) {
    for (let i = 0; i < users.length; i += 1) {
      const user = users[i];
      results.push({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    }
    return results;
  }

  // Throw error when one of the page_size or page_number is not queried
  else if ((number && !size) || (!number && size)) {
    throw errorResponder(
      errorTypes.UNPROCESSABLE_ENTITY,
      `One of the: page size or page number are not initialized`
    );
  }

  // If the page_number and page_size are queried
  else {
    const limit = ceil(users.length / size);
    if (number > limit) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        `Exceeded the page limit`
      );
    }

    // A function to return boolean value if the current page have a previous page
    function hasPrevPage(number, limit) {
      return number > 1 && limit > 1;
    }

    // A function to return boolean value if the current page have a next page
    function hasNextPage(number, limit) {
      return true ? number < limit : number < limit + 1;
    }

    const shift = (number - 1) * size;
    for (let i = shift; i < size + shift; i += 1) {
      const user = users[i];

      // Get out of the operation when the variable i exceeds the users length (null or NaN)
      if (users[i] == null || users[i] == NaN) {
        break;
      }

      // Push the users schema into the results[] array
      results.push({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    }

    return {
      page_number: number,
      page_size: size,
      count: users.length,
      total_pages: limit,
      has_previous_page: hasPrevPage(number, limit),
      has_next_page: hasNextPage(number, limit),
      data: results,
    };
  }
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
