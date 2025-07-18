// serverSide/routes/volunteerRoutes.js
const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { createVolunteer, getVolunteers, deleteVolunteer } = require("../controllers/volunteerController");
const Volunteer = require("../models/volunteerModel");
const router = express.Router();

// إضافة متطوع جديد (No auth required for submission)
router.post("/volunteer/submit", createVolunteer);

// جلب جميع المتطوعين (Admin only, filter by isDeleted = false)
router.get("/volunteer/all", verifyToken, async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: volunteers });
  } catch (error) {
    console.error("Get volunteers error:", error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب المتطوعين', error: error.message });
  }
});

// جلب متطوع واحد
router.get("/volunteer/:id", verifyToken, async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'المتطوع غير موجود' });
    }
    res.status(200).json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب بيانات المتطوع', error: error.message });
  }
});

// تحديث حالة المتطوع
router.patch("/volunteer/:id/status", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'حالة غير صالحة' });
    }

    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'المتطوع غير موجود' });
    }

    res.status(200).json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء تحديث حالة المتطوع', error: error.message });
  }
});

// حذف متطوع (Soft delete - Admin only)
router.delete("/volunteer/:id", verifyToken, async (req, res) => {
  try {
    // حذف ناعم: لا يتم حذف المتطوع فعلياً بل يتم تعيين isDeleted = true
    const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'المتطوع غير موجود' });
    }
    res.status(200).json({ success: true, message: 'تم حذف المتطوع بنجاح (حذف ناعم)', data: volunteer });
  } catch (error) {
    console.error("Soft delete volunteer error:", error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف المتطوع', error: error.message });
  }
});

// ممكن إضافة مسار لاستعادة متطوع محذوف ناعماً إذا لزم الأمر
// router.put("/volunteer/restore/:id", verifyToken, async (req, res) => { ... });

module.exports = router;
