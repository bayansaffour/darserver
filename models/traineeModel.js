// serverSide/models/traineeModel.js
const mongoose = require("mongoose");

const traineeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  nationalID: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  alternatePhone: { type: String },
  email: { type: String, required: true, unique: true },
  residence: { type: String, required: true },
  cv: { type: String }, // رابط ملف السيرة الذاتية
  referees: [{
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    position: { type: String, required: true },
    residence: { type: String }
  }],
  trainingField: { type: String, required: true },
  previousExperience: { type: Boolean, required: true },
  experienceDetails: { type: String },
  skills: { type: String },
  contribution: { type: String },
  source: { type: String },
  confirmation: { type: Boolean, required: true },
  status: { type: String, default: "pending", enum: ["pending", "approved", "rejected"] },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Trainee", traineeSchema);