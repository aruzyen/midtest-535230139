const authenticationRepository = require('../api/components/authentication/authentication-repository');
const usersRepository = require('../api/components/users/users-repository');
const timestamp = new Date().toISOString();

async function logSuccessLogin(email) {
  const user = await authenticationRepository.getUserByEmail(email);

  console.log(
    `[${timestamp}] User \x1b[34;4m${user.email}\x1b[0m berhasil login.`
  );
}

async function logFailAttempt(email) {
  const user = await authenticationRepository.getUserByEmail(email);

  if (user.loginAttempts == 5) {
    console.log(
      `[${timestamp}] User \x1b[34;4m${user.email}\x1b[0m gagal login. Attempt = ${user.loginAttempts}. Limit reached.`
    );
  } else {
    console.log(
      `[${timestamp}] User \x1b[34;4m${user.email}\x1b[0m gagal login. Attempt = ${user.loginAttempts}.`
    );
  }
}

async function logFailLimit(email) {
  const user = await authenticationRepository.getUserByEmail(email);

  console.log(
    `[${timestamp}] User \x1b[34;4m${user.email}\x1b[0m mencoba login, namun mendapat error 403 karena telah melebihi limit attempt.`
  );
}

async function logTimesOver(email) {
  const user = await authenticationRepository.getUserByEmail(email);

  console.log(
    `[${timestamp}] User \x1b[34;4m${user.email}\x1b[0m bisa mencoba login kembali karena sudah lebih dari ${usersRepository.LOCKED_LOGIN_DURATION} menit`
  );
}
module.exports = {
  logSuccessLogin,
  logFailAttempt,
  logFailLimit,
  logTimesOver,
};
