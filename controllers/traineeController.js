// serverSide/controllers/traineeController.js
const Trainee = require("../models/traineeModel");

// إضافة متدرب جديد
exports.createTrainee = async (req, res) => {
  try {
    const { fullName, nationalID, phone, email, residence, trainingField, previousExperience, confirmation } = req.body;

    // تحقق من الحقول المطلوبة
    if (!fullName || !nationalID || !phone || !email || !residence || !trainingField || !confirmation) {
      return res.status(400).json({ message: "يرجى ملء جميع الحقول المطلوبة." });
    }

    const newTrainee = await Trainee.create({ ...req.body, status: "pending" });
    res.status(201).json(newTrainee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// جلب جميع المتدربين
exports.getTrainees = async (req, res) => {
  try {
    const trainees = await Trainee.find();
    res.status(200).json(trainees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
