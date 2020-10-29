const mongoose = require('mongoose');

const { Schema } = mongoose;

const stateSchema = new Schema(
  {
    StateName: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const stateModel = mongoose.model('state', stateSchema);
module.exports = stateModel;
