// const mongoose = require("mongoose");

// const ArticleSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   date: {
//     type: Date,
//     required: true,
//     default: Date.now,
//   },
//   summary: {
//     type: String,
//     required: true,
//   },
//   imageUrl: {
//     type: String,
//     required: true,
//   },
//   content: {
//     type: String,
//     required: false,
//   },
//   isFeatured: {
//     type: Boolean,
//     default: false,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Article = mongoose.model("Article", ArticleSchema);

// module.exports = Article;
const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      default: "إدارة الموقع",
    },
    readTime: {
      type: String,
      required: true,
      default: "5 دقائق",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
