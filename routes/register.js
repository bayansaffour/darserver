const express = require("express");
const router = express.Router();
const { registerToProgram } = require("../controllers/registrationController");

router.post("/", registerToProgram);

module.exports = router;
