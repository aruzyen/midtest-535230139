const usersSchema = {
  name: String,
  email: String,
  password: String,
  loginAttempts: Number,
  lockedTime: Number,
};

module.exports = usersSchema;
