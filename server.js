require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");

// استيراد الـ routes
const newsRoutes = require("./routes/newsRoutes");
const authRoutes = require("./routes/authRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");
const successStoryRoutes = require("./routes/successStoryRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const traineeRoutes = require("./routes/traineeRoutes");
const partnerRoutes = require("./routes/partnerRoutes");
const individualPartnerRoutes = require("./routes/individualPartnerRoutes");
const program = require("./routes/programRoutes");
const registerRoutes = require("./routes/register");
const homeRoutes = require("./routes/homeRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// إنشاء مجلد uploads لو غير موجود
const fs = require("fs");
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// تقديم الملفات الثابتة - ملفات الرفع
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// لو عندك مجلد public للملفات الثابتة مثل favicon أو صور عامة
app.use(express.static(path.join(__dirname, "public")));

// ربط قاعدة البيانات
connectDB();

// التحقق من متغير البيئة الأساسي (JWT_SECRET)
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not defined in environment variables");
  process.exit(1);
}

// تعريف Routes الخاصة بالـ API
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api", volunteerRoutes);
app.use("/api", trainerRoutes);
app.use("/api", traineeRoutes);
app.use("/api", partnerRoutes);
app.use("/api", individualPartnerRoutes);
app.use("/api/add", subscriberRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/programs", program);
app.use("/api/register", registerRoutes);
app.use("/api/success", successStoryRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/upload", uploadRoutes);

// نقطة مهمة: لو عندك مشروع React مبني (مثلاً في مجلد ../client/dist)
// استضافة React - ضع المسار الصحيح حسب مكان مجلد build عندك
const reactBuildPath = path.join(__dirname, "../client/dist");
if (fs.existsSync(reactBuildPath)) {
  app.use(express.static(reactBuildPath));

  // إعادة توجيه كل الطلبات غير المعرفة إلى index.html لكي يعمل React Router
  app.get("*", (req, res) => {
    res.sendFile(path.join(reactBuildPath, "index.html"));
  });
} else {
  // لو ما عندك React مبني، احتفظ برد بسيط على جذر السيرفر
  app.get("/", (req, res) => {
    res.send("Backend is running ✅");
  });
}

// Middleware لمعالجة الأخطاء
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "حدث خطأ في الخادم",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// بدء تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log("Connecting to:", process.env.MONGO_URI);
});
