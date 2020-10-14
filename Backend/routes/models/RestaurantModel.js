const mongoose = require('mongoose');

const { Schema } = mongoose;

const restaurantSchema = new Schema(
  {
    name: { type: String, required: true },
    RestaurantID: { type: String, required: true },
    emailID: { type: String, required: true },
    contact: { type: Number, min: 1000000000, max: 9999999999, required: true },
    streetAddress: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zip: { type: Number, min: 10000, max: 99999, required: true },
    ImageURL: { type: String },
    Description: { type: String },
    Opening_Time: { type: String },
    Closing_Time: { type: String },
    Curbside_Pickup: { type: Boolean },
    Dine_In: { type: Boolean },
    Yelp_Delivery: { type: Boolean },
    Latitude: { type: String },
    Longitude: { type: String },
    Reviews: [
      {
        CustomerID: { type: String, required: true },
        CustomerName: { type: String, reuired: true },
        RestaurantID: { type: String, required: true },
        RestaurantName: { type: String, required: true },
        Ratings: { type: Number },
        Review: { type: String },
        Date: { type: Date },
      },
    ],
    CustomersFollowed: [
      {
        CustomerID: { type: String, required: true },
        CustomerName: { type: String, required: true },
        Contact: { type: String, required: true },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const restaurantModel = mongoose.model('restaurant', restaurantSchema);
module.exports = restaurantModel;
