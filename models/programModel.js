const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  startDate: String,
  endDate: String,
  ///ali edition
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Program", programSchema);

// const programs = [
//     {
//       id: 1,
//       name: "برنامج تطوير المهارات الرقمية",
//       category: "شباب",
//       description: "تدريب على المهارات الرقمية الأساسية والمتقدمة.",
//       startDate: "2025-06-01",
//       endDate: "2025-06-30",
//     },
//     {
//       id: 2,
//       name: "برنامج دعم ريادة الأعمال",
//       category: "ريادة أعمال",
//       description: "كيفية إطلاق مشروعك الخاص وتطويره.",
//       startDate: "2025-07-01",
//       endDate: "2025-08-01",
//     },
//     {
//       id: 3,
//       name: "برنامج تمكين المرأة",
//       category: "نساء",
//       description: "مهارات القيادة والتمكين الاقتصادي للنساء.",
//       startDate: "2025-05-20",
//       endDate: "2025-06-10",
//     },
//   ];

//   export default programs;
