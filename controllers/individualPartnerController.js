const IndividualPartner = require("../models/individualPartnerModel");

// إضافة شريك فردي جديد
exports.createIndividualPartner = async (req, res) => {
  try {
    const {
      fullName,
      nationalId,
      phone,
      email,
      residence,
      workField,
      supportType,
      supportReason,
      howDidYouHear,
      references,
      confirmation
    } = req.body;

    // تحقق من الحقول المطلوبة
    if (!fullName || !nationalId || !phone || !email || !residence || 
        !workField || !supportType || !supportReason || !howDidYouHear || 
        !references || !confirmation) {
      return res.status(400).json({ message: "يرجى ملء جميع الحقول المطلوبة." });
    }

    const newPartner = await IndividualPartner.create({ ...req.body, status: "pending" });
    res.status(201).json(newPartner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// جلب جميع الشركاء الأفراد
exports.getIndividualPartners = async (req, res) => {
  try {
    const partners = await IndividualPartner.find();
    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 