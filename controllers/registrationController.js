const Registration = require("../models/Registration");

exports.registerToProgram = async (req, res) => {
  const { programId, name, email, phone } = req.body;

  if (!programId || !name || !email || !phone) {
    return res.status(400).json({ message: "يرجى ملء جميع الحقول" });
  }
  const registration = new Registration({ programId, name, email, phone });
  await registration.save();

  res.json({ message: "✅ تم التسجيل بنجاح" });
};
