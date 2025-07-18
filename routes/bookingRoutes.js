const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/", bookingController.createBooking);
router.get("/booked-times", bookingController.getBookedTimes);
//ali addition
router.get("/", bookingController.getAllBookings); // Add this line
router.delete("/:id", bookingController.deleteBooking);
router.get("/unique-halls", bookingController.getUniqueHalls);

module.exports = router;
