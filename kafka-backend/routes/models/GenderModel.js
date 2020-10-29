const mongoose = require('mongoose');

const { Schema } = mongoose;

const genderSchema = new Schema(
  {
    GenderName: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const genderModel = mongoose.model('gender', genderSchema);
module.exports = genderModel;
