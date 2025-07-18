// serverSide/controllers/partnerController.js
const Partner = require("../models/partnerModel");

// إضافة شريك جديد
exports.createPartner = async (req, res) => {
  try {
    const { organizationName, organizationLocation, isLicensed, industry, director, liaison, partnershipType, duration, confirmation } = req.body;

    // تحقق من الحقول المطلوبة
    if (!organizationName || !organizationLocation || !isLicensed || !industry || !director || !liaison || !partnershipType || !duration || !confirmation) {
      return res.status(400).json({ message: "يرجى ملء جميع الحقول المطلوبة." });
    }

    const newPartner = await Partner.create({ ...req.body, status: "pending" });
    res.status(201).json(newPartner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// جلب جميع الشركاء
exports.getPartners = async (req, res) => {
  try {
    const partners = await Partner.find();
    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
