const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    CustomerID: { type: String, required: true },
    CustomerName: { type: String, reuired: true },
    RestaurantID: { type: String, required: true },
    RestaurantName: { type: String, required: true },
    ImageUrl: { type: String },
    Ratings: { type: Number },
    Review: { type: String },
    Date: { type: Date },
  },
  {
    versionKey: false,
  }
);

const reviewModel = mongoose.model('review', reviewSchema);
module.exports = reviewModel;
