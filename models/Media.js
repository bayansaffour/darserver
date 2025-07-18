const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["image", "video"],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: function () {
      return this.type === "video";
    },
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Media = mongoose.model("Media", MediaSchema);

module.exports = Media;
