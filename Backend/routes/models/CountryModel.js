const mongoose = require('mongoose');

const { Schema } = mongoose;

const countrySchema = new Schema(
  {
    CountryName: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const countryModel = mongoose.model('country', countrySchema);
module.exports = countryModel;
