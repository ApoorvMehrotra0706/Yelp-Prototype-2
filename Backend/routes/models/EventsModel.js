const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventsSchema = new Schema(
  {
    EventName: { type: String, required: true },
    RestaurantID: { type: String, required: true },
    // RestaurantName: { type: String, required: true },
    Description: { type: String },
    EventStartTime: { type: String, required: true },
    EventDate: { type: Date, required: true },
    Location: { type: String, required: true },
    Hashtags: { type: String, required: true },
    EventEndTime: { type: String, required: true },
    RegisteredCustomers: [
      {
        EventID: { type: String },
        EventName: { type: String },
        Description: { type: String },
        EventStartTime: { type: String },
        EventEndTime: { type: String },
        Address: { type: String },
        Hashtags: { type: String },
        CustomerID: { type: String, required: true },
        CustomerName: { type: String, reuired: true },
        Email: { type: String, required: true },
        Gender: { type: String, required: true },
        EventDate: { type: Date },
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
