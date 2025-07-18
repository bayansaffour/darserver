const Contact = require('../models/Contact');

// Submit contact form
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Create new contact message
    const contact = new Contact({
      name,
      email,
      phone,
      message
    });

    // Save to database
    await contact.save();

    res.status(201).json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إرسال الرسالة',
      error: error.message
    });
  }
};

// Get all contact messages (admin only)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الرسائل',
      error: error.message
    });
  }
}; 