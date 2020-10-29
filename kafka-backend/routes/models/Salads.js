const mongoose = require('mongoose');

const { Schema } = mongoose;

const saladsSchema = new Schema(
  {
    RestaurantID: { type: String, required: true },
    Dishname: { type: String, required: true },
    Price: { type: Number, required: true },
    Cuisine: { type: String, required: true },
    Main_Ingredients: { type: String, required: true },
    Description: { type: String },
    ImageURL: { type: String },
  },
  {
    versionKey: false,
  }
);

const saladsModel = mongoose.model('salad', saladsSchema);
module.exports = saladsModel;
