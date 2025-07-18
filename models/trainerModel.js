// serverSide/models/trainerModel.js
const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  nationalID: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  alternatePhone: { type: String },
  email: { type: String, required: true, unique: true },
  residence: { type: String, required: true },
  educationField: { type: String, required: true },
  trainingField: { type: String, required: true },
  experienceYears: { type: String, enum: ["0", "6 اشهر-سنة", "سنة – 3 سنوات", "اكثر من 3 سنوات"], required: true },
  cv: { type: String }, // رابط ملف السيرة الذاتية
  referees: [{
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    position: { type: String, required: true },
    residence: { type: String }
  }],
  confirmation: { type: Boolean, required: true },
  status: { type: String, default: "pending", enum: ["pending", "approved", "rejected"] },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Trainer", trainerSchema);