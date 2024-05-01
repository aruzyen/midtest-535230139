const authenticationRepository = require('./authentication-repository');
const usersRepository = require('../users/users-repository');
const myLogger = require('../../../core/my-logger');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { toInteger } = require('lodash');

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);
  const currentTime = new Date().getTime();

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  // Resets the locked in time when the time's over
  if (currentTime > user.lockedUntil) {
    await usersRepository.resetLockUserLogin(user.id);
    myLogger.logTimesOver(email);
  }

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {
    // Sets the user's login attempt to 0
    await usersRepository.resetLoginAttempt(user.id);
    await usersRepository.resetLockUserLogin(user.id);
    myLogger.logSuccessLogin(email);

    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  } else if (user && !passwordChecked && user.loginAttempts == 5) {
    await usersRepository.incrementLoginAttempt(user.id);
    await usersRepository.setLockUserLogin(user.id);

    myLogger.logFailAttempt(email);

    throw errorResponder(
      errorTypes.FORBIDDEN,
      'Too many failed login attempts.'
    );
  } else if ((user && user.loginAttempts > 5) || user.locked) {
    myLogger.logFailLimit(email);

    const remainingTime = toInteger(
      (user.lockedUntil - currentTime) / 60 / 1000
    );

    throw errorResponder(
      errorTypes.FORBIDDEN,
      `Due to many failed login attempts. Please wait for ${remainingTime} minutes.`
    );
  } else if (user && !passwordChecked) {
    // Increment the user's login attempts value
    await usersRepository.incrementLoginAttempt(user.id);

    myLogger.logFailAttempt(email);

    return {
      code: 999,
      message: 'Wrong password or email',
      attempt: user.loginAttempts,
    };
  }

  return null;
}

module.exports = {
  checkLoginCredentials,
};
