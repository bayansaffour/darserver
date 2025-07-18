// serverSide/models/partnerModel.js
const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema({
  organizationName: { type: String, required: true },
  organizationLocation: { type: String, required: true },
  isLicensed: { type: Boolean, required: true },
  industry: { type: String, required: true },
  director: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  liaison: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  partnershipType: { type: String, required: true },
  duration: { type: String, required: true },
  expectations: { type: String },
  ourOffer: { type: String },
  socialMedia: { type: String },
  licenseImage: { type: String }, // رابط صورة الترخيص
  source: { type: String },
  confirmation: { type: Boolean, required: true },
  status: { type: String, default: "pending", enum: ["pending", "approved", "rejected"] },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Partner", partnerSchema);