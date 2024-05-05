const authenticationRepository = require('./authentication-repository');
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

  // Tambahin base case biar reset 0

  // Immediately return null if user not detected to avoid errors
  if (!user) {
    return null;
  }

  // These variables are used to count user's locked out from logging in time
  const currentTime = new Date().getTime();
  const remainingTime = toInteger((user.lockedUntil - currentTime) / 60 / 1000);

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  // Resets the locked in time when the time's over
  if (user.locked && remainingTime <= 0) {
    await authenticationRepository.resetLoginAttempt(user.id);
    await authenticationRepository.resetLockUserLogin(user.id);
    myLogger.logTimesOver(email);

    return {
      message: 'Passed the 30 minutes locked time. You can try to login again.',
    };
  }

  // Checking user status for debugging
  let logStatus = false;
  myLogger.logUserStatus(email, logStatus);

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {
    // Sets the user's login attempt to 0
    await authenticationRepository.resetLoginAttempt(user.id);
    await authenticationRepository.resetLockUserLogin(user.id);
    myLogger.logSuccessLogin(email);

    // // Checking user status for debugging
    // let logStatus = true;
    myLogger.logUserStatus(email, logStatus);

    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };

    // Sets the locked timer when login attempts reached 5
    // and increment it one more time to trigger another log message
  } else if (user && !passwordChecked && user.loginAttempts == 5) {
    await authenticationRepository.incrementLoginAttempt(user.id);
    await authenticationRepository.setLockUserLogin(user.id);
    myLogger.logFailLogin(email);

    throw errorResponder(
      errorTypes.FORBIDDEN,
      'Too many failed login attempts.'
    );

    // Disabling login feature when login attempts > 5 or user locked status is true
    // returning the remaining time to user
  } else if ((user && user.loginAttempts > 5) || user.locked) {
    myLogger.logFailLogin(email);

    throw errorResponder(
      errorTypes.FORBIDDEN,
      `Due to many failed login attempts. Please wait for ${remainingTime} minutes.`
    );

    // Incrementing login attempt when user's password isn't valid
  } else if (user && !passwordChecked) {
    incremented = await authenticationRepository.incrementLoginAttempt(user.id);
    myLogger.logFailLogin(email) ? incremented : 0;

    throw errorResponder(
      errorTypes.INVALID_PASSWORD,
      `Wrong password. Please try again (Attempts: ${user.loginAttempts + 1})`
    );
  }

  return null;
}

module.exports = {
  checkLoginCredentials,
};
