const mongoose = require('mongoose');

const { Schema } = mongoose;

const custEventsSchema = new Schema(
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
    Contact: { type: Number },
    YelpingSince: { type: Date },
  },

  {
    versionKey: false,
  }
);

const custEventsModel = mongoose.model('customerEvents', custEventsSchema);
module.exports = custEventsModel;
