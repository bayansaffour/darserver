const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const jwt = require('jsonwebtoken');

// Middleware للتحقق من المصادقة
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح لك بالوصول'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'توكن غير صالح'
    });
  }
};

// Submit contact form
router.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول مطلوبة'
      });
    }

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
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إرسال الرسالة',
      error: error.message
    });
  }
});

// Get all contact messages (admin only)
router.get('/all', verifyToken, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الرسائل',
      error: error.message
    });
  }
});

// Delete contact message (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // حذف ناعم: لا يتم حذف الرسالة فعلياً بل يتم تعيين isDeleted = true
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'الرسالة غير موجودة'
      });
    }
    res.status(200).json({
      success: true,
      message: 'تم حذف الرسالة بنجاح (حذف ناعم)'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف الرسالة',
      error: error.message
    });
  }
});

module.exports = router; 