const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "يرجى إدخال عنوان المورد"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "يرجى إدخال وصف المورد"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "يرجى تحديد فئة المورد"],
      enum: ["articles", "videos", "presentations", "pdf"],
    },
    fileUrl: {
      type: String,
      required: function () {
        return !this.externalUrl; // Either fileUrl or externalUrl must be provided
      },
    },
    externalUrl: {
      type: String,
      required: function () {
        return !this.fileUrl; // Either fileUrl or externalUrl must be provided
      },
    },
    thumbnailUrl: {
      type: String,
      default: "/images/default-resource-thumbnail.jpg",
    },
    isDownloadable: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: String,
      default: "دار الحسام",
    },
    filePath: {
      type: String, // Path on server for downloadable files
      required: function () {
        return this.isDownloadable;
      },
    },
    fileSize: {
      type: Number, // In bytes
      default: 0,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    featuredOrder: {
      type: Number,
      default: 0, // Higher numbers will appear first in featured sections
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // This will automatically update createdAt and updatedAt
  }
);

// Text indexing for search functionality
resourceSchema.index({
  title: "text",
  description: "text",
  tags: "text",
});

// Instance method to increment download count
resourceSchema.methods.incrementDownloadCount = async function () {
  this.downloadCount += 1;
  return this.save();
};

// Instance method to increment view count
resourceSchema.methods.incrementViewCount = async function () {
  this.viewCount += 1;
  return this.save();
};

// Static method to find resources by tag
resourceSchema.statics.findByTag = function (tag) {
  return this.find({ tags: tag });
};

// Static method to find featured resources
resourceSchema.statics.findFeatured = function (limit = 5) {
  return this.find({ status: "published" })
    .sort({ featuredOrder: -1, createdAt: -1 })
    .limit(limit);
};

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;