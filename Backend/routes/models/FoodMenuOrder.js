const mongoose = require('mongoose');

const { Schema } = mongoose;

const foodMenuSchema = new Schema(
  {
    RestaurantName: { type: String, required: true },
    Dishname: { type: String, required: true },
    Price: { type: Number, required: true },
    Cuisine: { type: String, required: true },
    Main_Ingredients: { type: String, required: true },
    Description: { type: String },
    ImageURL: { type: String },
    FoodType: {
      type: String,
      required: true,
      enum: ['Appetizer', 'Beverages', 'MainCourse', 'Salads', 'Desserts'],
    },
  },
  {
    versionKey: false,
  }
);

const foodMenuModel = mongoose.model('foodMenu', foodMenuSchema);
module.exports = foodMenuModel;
