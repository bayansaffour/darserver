// successStoryRoutes.js
const express = require("express");
const router = express.Router();
const {
  getSuccessStories,
  createSuccessStory,
  updateSuccessStory,
  softDeleteSuccessStory,
  restoreSuccessStory,
  deleteSuccessStory,
} = require("../controllers/successStoryController.js");

router.get("/", getSuccessStories);
router.post("/", createSuccessStory);
router.put("/:id", updateSuccessStory);
router.patch("/:id/soft-delete", softDeleteSuccessStory);
router.patch("/:id/restore", restoreSuccessStory);
router.delete("/:id", deleteSuccessStory);

module.exports = router;
