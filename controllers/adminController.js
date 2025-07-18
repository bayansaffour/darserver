const Admin = require('../models/Admin');
const Contact = require('../models/Contact');
const Volunteer = require('../models/volunteerModel');
const Trainer = require('../models/trainerModel');
const Trainee = require('../models/traineeModel');
const Partner = require('../models/partnerModel');
const IndividualPartner = require('../models/individualPartnerModel');
const jwt = require('jsonwebtoken');

// Login admin
exports.login = async (req, res) => {
  try {
    console.log('Login attempt with:', { username: req.body.username });
    
    const { username, password } = req.body;

    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال اسم المستخدم وكلمة المرور'
      });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ username });
    console.log('Admin found:', admin ? 'Yes' : 'No');
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing');
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Login successful for:', username);

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تسجيل الدخول',
      error: error.message
    });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      contacts,
      volunteers,
      trainers,
      trainees,
      partners,
      individualPartners
    ] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }),
      Volunteer.find({ isDeleted: false }).sort({ createdAt: -1 }),
      Trainer.find({ isDeleted: false }).sort({ createdAt: -1 }),
      Trainee.find({ isDeleted: false }).sort({ createdAt: -1 }),
      Partner.find({ isDeleted: false }).sort({ createdAt: -1 }),
      IndividualPartner.find({ isDeleted: false }).sort({ createdAt: -1 })
    ]);

    res.status(200).json({
      success: true,
      data: {
        contacts,
        volunteers,
        trainers,
        trainees,
        partners,
        individualPartners,
        stats: {
          totalContacts: contacts.length,
          totalVolunteers: volunteers.length,
          totalTrainers: trainers.length,
          totalTrainees: trainees.length,
          totalPartners: partners.length,
          totalIndividualPartners: individualPartners.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب البيانات',
      error: error.message
    });
  }
};

// Create initial admin (for first-time setup)
exports.createInitialAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'المشرف موجود مسبقاً'
      });
    }

    // Create new admin
    const admin = new Admin({
      username,
      password
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'تم إنشاء المشرف بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إنشاء المشرف',
      error: error.message
    });
  }
}; 