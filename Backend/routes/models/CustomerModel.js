const mongoose = require('mongoose');

const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    CustomerID: { type: String, reqired: true },
    gender: { type: String, required: true },
    DOB: { type: Date },
    NickName: { type: String },
    contact: { type: Number, min: 1000000000, max: 9999999999 },
    streetAddress: { type: String },
    City: { type: String },
    state: { type: String },
    country: { type: String },
    Contact: { type: Number },
    zip: { type: Number, min: 10000, max: 99999, required: true },
    ImageURL: { type: String },
    Headline: { type: String },
    Find_Me_In: { type: String },
    YelpingSince: { type: Date },
    Things_Customer_Love: { type: String },
    Website: { type: String },
    Events: [
      {
        EventID: { type: String },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const customerModel = mongoose.model('customer', customerSchema);
module.exports = customerModel;
