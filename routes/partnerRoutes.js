// serverSide/routes/partnerRoutes.js
const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { createPartner } = require("../controllers/partnerController");
const router = express.Router();

// إضافة شريك جديد (No auth required for submission)
router.post("/partner/submit", createPartner);

// جلب جميع الشركاء (Admin only, filter by isDeleted = false)
router.get("/partner/all", verifyToken, async (req, res) => {
  try {
    const Partner = require("../models/partnerModel");
    const partners = await Partner.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: partners });
  } catch (error) {
    console.error("Get partners error:", error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب الشركاء', error: error.message });
  }
});

// جلب شريك واحد
router.get("/partner/:id", verifyToken, async (req, res) => {
  try {
    const Partner = require("../models/partnerModel");
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'الشريك غير موجود' });
    }
    res.status(200).json({ success: true, data: partner });
  } catch (error) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب بيانات الشريك', error: error.message });
  }
});

// تحديث حالة الشريك
router.patch("/partner/:id/status", verifyToken, async (req, res) => {
  try {
    const Partner = require("../models/partnerModel");
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'حالة غير صالحة' });
    }

    const partner = await Partner.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!partner) {
      return res.status(404).json({ success: false, message: 'الشريك غير موجود' });
    }

    res.status(200).json({ success: true, data: partner });
  } catch (error) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء تحديث حالة الشريك', error: error.message });
  }
});

// حذف شريك (Soft delete - Admin only)
router.delete("/partner/:id", verifyToken, async (req, res) => {
  try {
    const Partner = require("../models/partnerModel");
    const partner = await Partner.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!partner) {
      return res.status(404).json({ success: false, message: 'الشريك غير موجود' });
    }
    res.status(200).json({ success: true, message: 'تم حذف الشريك بنجاح (حذف ناعم)', data: partner });
  } catch (error) {
    console.error("Soft delete partner error:", error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف الشريك', error: error.message });
  }
});

module.exports = router;
