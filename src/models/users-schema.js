const usersSchema = {
  name: String,
  email: String,
  password: String,
  loginAttempts: Number,
  lockedStatus: Boolean,
};

module.exports = usersSchema;
