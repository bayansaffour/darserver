const express = require("express");
const router = express.Router();
const {
  getAllPrograms,
  getAllEvents,
  getAllSuccessStories
} = require("../controllers/homeController");

router.get("/programs", getAllPrograms);
router.get("/events", getAllEvents);
router.get("/success-stories", getAllSuccessStories);



module.exports = router;