const mongoose = require('mongoose');

const { Schema } = mongoose;

const messagesSchema = new Schema(
  {
    RestaurantID: { type: String, required: true },
    RestaurantName: { type: String, required: true },
    CustomerID: { type: String, required: true },
    CustomerName: { type: String, required: true },
    Messages: { type: String, required: true },
    Date: { type: Date, required: true },
  },
  {
    versionKey: false,
  }
);

const messagesModel = mongoose.model('login', messagesSchema);
module.exports = messagesModel;
