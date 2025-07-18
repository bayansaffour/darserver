const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { createIndividualPartner } = require("../controllers/individualPartnerController");
const router = express.Router();

// إضافة شريك فردي جديد (No auth required for submission)
router.post("/individual-partner/submit", createIndividualPartner);

// جلب جميع الشركاء الأفراد (Admin only, filter by isDeleted = false)
router.get("/individual-partner/all", verifyToken, async (req, res) => {
  try {
    const IndividualPartner = require("../models/individualPartnerModel"); // Import model here
    const individualPartners = await IndividualPartner.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: individualPartners });
  } catch (error) {
    console.error("Get individual partners error:", error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب الشركاء الأفراد', error: error.message });
  }
});

// حذف شريك فردي (Soft delete - Admin only)
router.delete("/individual-partner/:id", verifyToken, async (req, res) => {
  try {
    const IndividualPartner = require("../models/individualPartnerModel"); // Import model here
    const partner = await IndividualPartner.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!partner) {
      return res.status(404).json({ success: false, message: 'الشريك غير موجود' });
    }
    res.status(200).json({ success: true, message: 'تم حذف الشريك بنجاح (حذف ناعم)', data: partner });
  } catch (error) {
    console.error("Soft delete individual partner error:", error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف الشريك', error: error.message });
  }
});

module.exports = router; 