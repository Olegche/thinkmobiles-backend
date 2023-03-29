const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  events: [

    {
      eventId: {type: [String,Object]},
      eventTitle: { type: String, required: true },
      eventDescription: { type: String},
      startDate: { type: Date},
      endDate: { type: Date},
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
