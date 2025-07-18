const mongoose = require("mongoose");

const individualPartnerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  nationalId: { type: String, required: true },
  phone: { type: String, required: true },
  alternativePhone: { type: String },
  email: { type: String, required: true },
  residence: { type: String, required: true },
  workField: { type: String, required: true },
  supportType: { type: String, required: true },
  supportReason: { type: String, required: true },
  howDidYouHear: { type: String, required: true },
  references: { type: String, required: true },
  cv: { type: String }, // Base64 string of CV file
  socialMedia: { type: String },
  confirmation: { type: Boolean, required: true },
  status: { type: String, default: "pending", enum: ["pending", "approved", "rejected"] },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("IndividualPartner", individualPartnerSchema); 