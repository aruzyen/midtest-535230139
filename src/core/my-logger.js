const authenticationRepository = require('../api/components/authentication/authentication-repository');
const usersRepository = require('../api/components/users/users-repository');
const timestamp = new Date().toISOString();

// I created this file for debugging

/**
 * Log user status to monitor the variables needed
 * @param {String} email - User's email
 * @param {Boolean} logStatus - Log needed before or after the operation
 */
async function logUserStatus(email, logStatus) {
  const user = await authenticationRepository.getUserByEmail(email);
  const currentTime = new Date().getTime();
  const remainingTime = (user.lockedUntil - currentTime) / 60 / 1000;

  let condition = 'value';

  if (logStatus) {
    condition = 'After';
  } else {
    condition = 'Before';
  }

  console.log({
    'Log_Status': condition,
    'User_LoginAttempts: ': user.loginAttempts,
    'User_Locked: ': user.locked,
    'User_LockedUntil (minutes): ': remainingTime,
    'User_LockedUntil (ticks)': user.lockedUntil,
  });
}

/**
 * Log the message when user successfully log in
 * @param {String} email - User's email
 */
async function logSuccessLogin(email) {
  const user = await authenticationRepository.getUserByEmail(email);

  console.log(
    `[${timestamp}] User \x1b[34;4m${user.email}\x1b[0m berhasil login.`
  );
}

/**
 * Log the message when user failed to log in
 * @param {String} email - User's email
 */
async function logFailLogin(email) {
  const user = await authenticationRepository.getUserByEmail(email);

  if (user.loginAttempts == 5) {
    console.log(
      `[${timestamp}] User \x1b[34;4m${user.email}\x1b[0m gagal login. Attempt = ${user.loginAttempts}. Limit reached.`
    );
  } else if (user.loginAttempts > 5) {
    console.log(
      `[${timestamp}] User \x1b[34;4m${user.email}\x1b[0m mencoba login, namun mendapat error 403 karena telah melebihi limit attempt.`
    );
  } else {
    console.log(
      `[${timestamp}] User \x1b[34;4m${user.email}\x1b[0m gagal login. Attempt = ${user.loginAttempts}.`
    );
  }
}

/**
 * Log the message when user's
 * @param {String} email - User's email
 */
async function logTimesOver(email) {
  const user = await authenticationRepository.getUserByEmail(email);

  console.log(
    `[${timestamp}] User \x1b[34;4m${user.email}\x1b[0m bisa mencoba login kembali karena sudah lebih dari ${usersRepository.LOCKED_LOGIN_DURATION} menit sejak pengenaan limit. Attempt di-\x1b[3mreset\x1b[0m kembali ke 0.`
  );
}
module.exports = {
  logUserStatus,
  logSuccessLogin,
  logFailLogin,
  logTimesOver,
};
