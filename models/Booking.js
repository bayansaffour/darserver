const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  hallId: { type: Number, required: true },
  hallName: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
