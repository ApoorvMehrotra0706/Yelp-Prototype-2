const mongoose = require('mongoose');

const { Schema } = mongoose;

const loginSchema = new Schema(
  {
    emailID: { type: String, required: true },
    Password: { type: String, required: true },
    Role: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const loginModel = mongoose.model('login', loginSchema);
module.exports = loginModel;
