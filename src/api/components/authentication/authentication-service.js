const authenticationRepository = require('./authentication-repository');
const usersRepository = require('../users/users-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { toInteger } = require('lodash');
const timestamp = new Date().toISOString();

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {
    // Sets the user's login attempt to 0
    await usersRepository.resetLoginAttempt(user.id);
    await usersRepository.resetLockUserLogin(user.id);

    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  } else if (user && !passwordChecked && user.loginAttempts == 5) {
    await usersRepository.incrementLoginAttempt(user.id);
    await usersRepository.setLockUserLogin(user.id);

    console.log(
      `[${timestamp}] User \x1b[34;4m${user.email}\x1b[0m gagal login. Attempt=${user.loginAttempts}. Limit reached.`
    );

    throw errorResponder(
      errorTypes.FORBIDDEN,
      'Too many failed login attempts.'
    );
  } else if ((user && user.loginAttempts > 5) || user.locked) {
    console.log(
      `[${timestamp}] User \x1b[34;4m${user.email}\x1b[0m mencoba login, namun mendapat error 403 karena telah melebihi limit attempt.`
    );

    const currentTime = new Date().getTime();
    console.log(`Current_Time: `, currentTime);
    console.log(`Users_Locked_Time: `, user.lockedUntil);
    const remainingTime = toInteger(
      (user.lockedUntil - currentTime) / 60 / 1000
    );
    console.log(`Remaining_Time: `, remainingTime, `minutes`);

    console.log(`Account_Status: `, user.locked);

    throw errorResponder(
      errorTypes.FORBIDDEN,
      `Due to many failed login attempts. Please wait for ${remainingTime} minutes.`
    );
  } else if (user && !passwordChecked) {
    // Increment the user's login attempts value
    const incremented = await usersRepository.incrementLoginAttempt(user.id);

    if (incremented) {
      console.log(
        `[${timestamp}] User \x1b[34;4m${user.email}\x1b[0m gagal login. Attempt=${user.loginAttempts}`
      );
    }

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
