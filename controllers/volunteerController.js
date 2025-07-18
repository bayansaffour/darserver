// serverSide/controllers/volunteerController.js
const Volunteer = require("../models/volunteerModel");

// إضافة متطوع جديد
exports.createVolunteer = async (req, res) => {
  try {
    const { 
      fullName, 
      nationalID, 
      phone, 
      email,
      residence, 
      educationLevel, 
      previousExperience, 
      preferredField, 
      availability 
    } = req.body;

    // تحقق من الحقول المطلوبة
    if (
      !fullName || 
      !nationalID || 
      !phone || 
      !email ||
      !residence || 
      !educationLevel || 
      previousExperience === undefined || 
      !preferredField || 
      !availability
    ) {
      return res.status(400).json({ message: "يرجى ملء جميع الحقول المطلوبة." });
    }

    const newVolunteer = await Volunteer.create(req.body);
    res.status(201).json(newVolunteer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// جلب جميع المتطوعين
exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
