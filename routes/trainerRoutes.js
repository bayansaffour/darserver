// serverSide/routes/trainerRoutes.js
const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { createTrainer } = require("../controllers/trainerController");
const router = express.Router();

// إضافة مدرب جديد (No auth required for submission)
router.post("/trainer/submit", createTrainer);

// جلب جميع المدربين (Admin only, filter by isDeleted = false)
router.get("/trainer/all", verifyToken, async (req, res) => {
  try {
    const Trainer = require("../models/trainerModel");
    const trainers = await Trainer.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: trainers });
  } catch (error) {
    console.error("Get trainers error:", error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب المدربين', error: error.message });
  }
});

// جلب مدرب واحد
router.get("/trainer/:id", verifyToken, async (req, res) => {
  try {
    const Trainer = require("../models/trainerModel");
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'المدرب غير موجود' });
    }
    res.status(200).json({ success: true, data: trainer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب بيانات المدرب', error: error.message });
  }
});

// تحديث حالة المدرب
router.patch("/trainer/:id/status", verifyToken, async (req, res) => {
  try {
    const Trainer = require("../models/trainerModel");
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'حالة غير صالحة' });
    }

    const trainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!trainer) {
      return res.status(404).json({ success: false, message: 'المدرب غير موجود' });
    }

    res.status(200).json({ success: true, data: trainer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء تحديث حالة المدرب', error: error.message });
  }
});

// حذف مدرب (Soft delete - Admin only)
router.delete("/trainer/:id", verifyToken, async (req, res) => {
  try {
    const Trainer = require("../models/trainerModel");
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'المدرب غير موجود' });
    }
    res.status(200).json({ success: true, message: 'تم حذف المدرب بنجاح (حذف ناعم)', data: trainer });
  } catch (error) {
    console.error("Soft delete trainer error:", error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف المدرب', error: error.message });
  }
});

module.exports = router;
