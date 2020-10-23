const mongoose = require('mongoose');

const { Schema } = mongoose;

const ordersSchema = new Schema(
  {
    RestaurantID: { type: String, required: true },
    RestaurantName: { type: String, required: true },
    CustomerID: { type: String, required: true },
    CustomerName: { type: String, required: true },
    ImageURL: { type: String },
    CustomerGender: { type: String },
    CustomerContact: { type: String },
    CustomerYelpingSince: { type: Date },
    Date: { type: Date },
    Bill: { type: Number },
    DeliveryMode: {
      type: String,
      required: true,
      enum: ['Pickup', 'Delivery'],
    },
    StatusID: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5, 6],
    },
    Status: {
      type: String,
      required: true,
      enum: [
        'Order Received',
        'Preparing',
        'On the way',
        'Delivered',
        'Pick up Ready',
        'Picked up',
        'Canceled',
      ],
    },
    State: {
      type: String,
      required: true,
      enum: ['New', 'Delivered', 'Canceled'],
    },
    Orders: [
      // Bill
      {
        Dishname: { type: String, required: true },
        Price: { type: Number, required: true },
        Quantity: { type: Number, required: true },
        TotalPrice: { type: Number, required: true },
        RestaurantID: { type: String, required: true },
      },
    ],
    Address: { type: String },
  },
  {
    versionKey: false,
  }
);

const ordersModel = mongoose.model('order', ordersSchema);
module.exports = ordersModel;
