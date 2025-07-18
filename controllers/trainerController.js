// serverSide/controllers/trainerController.js
const Trainer = require("../models/trainerModel");

// إضافة مدرب جديد
exports.createTrainer = async (req, res) => {
  try {
    const { fullName, nationalID, phone, email, residence, educationField, trainingField, experienceYears, referees, confirmation } = req.body;

    // تحقق من الحقول المطلوبة
    if (!fullName || !nationalID || !phone || !email || !residence || !educationField || !trainingField || !experienceYears || !confirmation) {
      return res.status(400).json({ message: "يرجى ملء جميع الحقول المطلوبة." });
    }

    const newTrainer = await Trainer.create({ ...req.body, status: "pending" });
    res.status(201).json(newTrainer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// جلب جميع المدربين
exports.getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.status(200).json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
