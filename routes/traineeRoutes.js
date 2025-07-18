// serverSide/routes/traineeRoutes.js
const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { createTrainee } = require("../controllers/traineeController");
const router = express.Router();

// إضافة متدرب جديد (No auth required for submission)
router.post("/trainee/submit", createTrainee);

// جلب جميع المتدربين (Admin only, filter by isDeleted = false)
router.get("/trainee/all", verifyToken, async (req, res) => {
  try {
    const Trainee = require("../models/traineeModel");
    const trainees = await Trainee.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: trainees });
  } catch (error) {
    console.error("Get trainees error:", error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب المتدربين', error: error.message });
  }
});

// جلب متدرب واحد
router.get("/trainee/:id", verifyToken, async (req, res) => {
  try {
    const Trainee = require("../models/traineeModel");
    const trainee = await Trainee.findById(req.params.id);
    if (!trainee) {
      return res.status(404).json({ success: false, message: 'المتدرب غير موجود' });
    }
    res.status(200).json({ success: true, data: trainee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب بيانات المتدرب', error: error.message });
  }
});

// تحديث حالة المتدرب
router.patch("/trainee/:id/status", verifyToken, async (req, res) => {
  try {
    const Trainee = require("../models/traineeModel");
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'حالة غير صالحة' });
    }

    const trainee = await Trainee.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!trainee) {
      return res.status(404).json({ success: false, message: 'المتدرب غير موجود' });
    }

    res.status(200).json({ success: true, data: trainee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء تحديث حالة المتدرب', error: error.message });
  }
});

// حذف متدرب (Soft delete - Admin only)
router.delete("/trainee/:id", verifyToken, async (req, res) => {
  try {
    const Trainee = require("../models/traineeModel");
    const trainee = await Trainee.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!trainee) {
      return res.status(404).json({ success: false, message: 'المتدرب غير موجود' });
    }
    res.status(200).json({ success: true, message: 'تم حذف المتدرب بنجاح (حذف ناعم)', data: trainee });
  } catch (error) {
    console.error("Soft delete trainee error:", error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف المتدرب', error: error.message });
  }
});

module.exports = router;
