const express = require("express");
const router = express.Router();

// مجرد مسار تجريبي مؤقت
router.get("/", (req, res) => {
  res.send("User Routes Working");
});

module.exports = router;
