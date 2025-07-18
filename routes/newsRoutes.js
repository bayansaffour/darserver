// const express = require("express");
// const {
//   getArticles,
//   createArticle,
//   getEvents,
//   createEvent,
//   getMedia,
//   createMedia,
// } = require("../controllers/newsController.js");

// const router = express.Router();

// // Articles routes
// router.get("/articles", getArticles);
// router.post("/articles", createArticle);

// // Events routes
// router.get("/events", getEvents);
// router.post("/events", createEvent);

// // Media routes
// router.get("/media", getMedia);
// router.post("/media", createMedia);

// module.exports = router;
const express = require("express");
const {
  getArticles,
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getMedia,
  createMedia,
  seedDatabase,
} = require("../controllers/newsController.js");
const { uploadSingle } = require("../middlewares/upload.js");

const router = express.Router();

// Articles routes
router.get("/articles", getArticles);
router.get("/articles/:id", getArticleById);
router.post("/articles", uploadSingle("image"), createArticle);
router.put("/articles/:id", uploadSingle("image"), updateArticle);
router.delete("/articles/:id", deleteArticle);
router.post("/seed", seedDatabase);

// Events routes
router.get("/events", getEvents);
router.get("/events/:id", getEventById);
router.post("/events", uploadSingle("image"), createEvent);
router.put("/events/:id", uploadSingle("image"), updateEvent);
router.delete("/events/:id", deleteEvent);

// Media routes
router.get("/media", getMedia);
router.post("/media", uploadSingle("media"), createMedia);

module.exports = router;
