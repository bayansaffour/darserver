const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  programId: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },
  name: String,
  email: String,
  phone: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Registration", registrationSchema);
