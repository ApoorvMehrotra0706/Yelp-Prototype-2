const mongoose = require("mongoose");

const { Schema } = mongoose;

const messagesSchema = new Schema(
  {
    RestaurantID: { type: String, required: true },
    RestaurantName: { type: String, required: true },
    CustomerID: { type: String, required: true },
    CustomerName: { type: String, required: true },
    RestaurantImg: { type: String },
    CustomerImg: { type: String },
    Date: { type: Date },
    Messages: [
      {
        Date: { type: Date },
        Name: { type: String },
        Message: { type: String },
        CustomerID: { type: String },
        RestaurantID: { type: String },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const messagesModel = mongoose.model("message", messagesSchema);
module.exports = messagesModel;
