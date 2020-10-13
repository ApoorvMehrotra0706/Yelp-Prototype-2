const mongoose = require('mongoose');

const { Schema } = mongoose;

const ordersSchema = new Schema(
  {
    RestaurantID: { type: String, required: true },
    RestaurantName: { type: String, required: true },
    CustomerID: { type: String, required: true },
    CustomerName: { type: String, required: true },
    ImageURL: { type: String },
    DeliveryMode: {
      type: String,
      required: true,
      enum: ['Pickup', 'Delivery'],
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
      ],
    },
    State: {
      type: String,
      required: true,
      enum: ['New', 'Delivered', 'Canceled'],
    },
    Orders: [
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

const ordersModel = mongoose.model('orders', ordersSchema);
module.exports = ordersModel;
