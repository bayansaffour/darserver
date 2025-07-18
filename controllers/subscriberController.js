const Subscriber = require('../models/subscriberModel');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.subscribe = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    // تجنّب التكرار
    if (await Subscriber.findOne({ email })) {
      return res.status(409).json({ error: 'Already subscribed' });
    }
    await Subscriber.create({ email });

    // إرسال إيميل ترحيب
    await sgMail.send({
      to: email,
      from: process.env.EMAIL_FROM,
      subject: 'شكراً لاشتراكك',
      html: '<h1>أهلاً!</h1><p>تم تسجيلك بنجاح في نشرتنا.</p>'
    });

    res.json({ message: 'Subscribed & welcome email sent' });
  } catch (err) {
    console.error('Subscribe error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
