const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventsSchema = new Schema(
  {
    EventName: { type: String, required: true },
    RestaurantID: { type: String, required: true },
    RestaurantName: { type: String, required: true },
    Description: { type: String },
    EventStartTime: { type: String, required: true },
    EventDate: { type: Date, required: true },
    Location: { type: String, required: true },
    Hashtages: { type: String, required: true },
    EventEndTime: { type: String, required: true },
    RegisteredCustomers: [
      {
        CustomerID: { type: String, required: true },
        CustomerName: { type: String, reuired: true },
        Gender: { type: String, required: true },
        Contact: { type: Number, max: 10 },
        YelpingSince: { type: Date },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const eventsModel = mongoose.model('events', eventsSchema);
module.exports = eventsModel;
