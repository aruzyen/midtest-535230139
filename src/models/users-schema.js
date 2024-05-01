const usersSchema = {
  name: String,
  email: String,
  password: String,
  loginAttempts: Number,
  locked: Boolean,
  lockedUntil: Number,
};

module.exports = usersSchema;
