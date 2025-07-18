// const Article = require("../models/Article");
// const Event = require("../models/Event");
// const Media = require("../models/Media");

// // Articles Controllers
// const getArticles = async (req, res) => {
//   try {
//     const articles = await Article.find().sort({ date: -1 });
//     res.status(200).json(articles);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// const createArticle = async (req, res) => {
//   const article = req.body;
//   const newArticle = new Article(article);

//   try {
//     await newArticle.save();
//     res.status(201).json(newArticle);
//   } catch (error) {
//     res.status(409).json({ message: error.message });
//   }
// };

// // Events Controllers
// const getEvents = async (req, res) => {
//   try {
//     const events = await Event.find().sort({ date: 1 }); // Sort by date ascending
//     res.status(200).json(events);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// const createEvent = async (req, res) => {
//   const event = req.body;
//   const newEvent = new Event(event);

//   try {
//     await newEvent.save();
//     res.status(201).json(newEvent);
//   } catch (error) {
//     res.status(409).json({ message: error.message });
//   }
// };

// // Media Controllers
// const getMedia = async (req, res) => {
//   try {
//     const media = await Media.find().sort({ createdAt: -1 });
//     res.status(200).json(media);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// const createMedia = async (req, res) => {
//   const media = req.body;
//   const newMedia = new Media(media);

//   try {
//     await newMedia.save();
//     res.status(201).json(newMedia);
//   } catch (error) {
//     res.status(409).json({ message: error.message });
//   }
// };

// // Export all controller functions
// module.exports = {
//   getArticles,
//   createArticle,
//   getEvents,
//   createEvent,
//   getMedia,
//   createMedia,
// };
const Article = require("../models/Article");
const Event = require("../models/Event");
const Media = require("../models/Media");
const path = require("path");
const fs = require("fs");

// Helper function to handle file paths
const getFilePath = (file) => {
  if (!file) return null;
  return `/uploads/${file.filename}`;
};

// Articles Controllers
const getArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ date: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const createArticle = async (req, res) => {
//   try {
//     const { title, date, summary, content, isFeatured } = req.body;

//     const newArticle = new Article({
//       title,
//       date: date || Date.now(),
//       summary,
//       content,
//       isFeatured: isFeatured || false,
//       imageUrl: getFilePath(req.file),
//     });

//     await newArticle.save();
//     res.status(201).json(newArticle);
//   } catch (error) {
//     res.status(409).json({ message: error.message });
//   }
// };

// In your newsController.js
const createArticle = async (req, res) => {
  try {
    const { title, date, summary, content, author, readTime, isFeatured } =
      req.body;

    // Ensure imageUrl is properly formatted
    const imageUrl = req.file ? "/uploads/" + req.file.filename : null;

    const newArticle = new Article({
      title,
      date: date || Date.now(),
      summary,
      content,
      author: author || "إدارة الموقع",
      readTime: readTime || "5 دقائق",
      isFeatured: isFeatured || false,
      imageUrl,
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, summary, content, isFeatured } = req.body;

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Handle image update
    let imageUrl = article.imageUrl;
    if (req.file) {
      // Delete old image if it exists
      if (article.imageUrl) {
        const oldImagePath = path.join(
          __dirname,
          "../public",
          article.imageUrl
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageUrl = getFilePath(req.file);
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      {
        title,
        date,
        summary,
        content,
        isFeatured,
        imageUrl,
      },
      { new: true }
    );

    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Delete associated image
    if (article.imageUrl) {
      const imagePath = path.join(__dirname, "../public", article.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Article.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Events Controllers
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, date, location, time, description, capacity } = req.body;

    const newEvent = new Event({
      title,
      date,
      location,
      time,
      description,
      capacity: capacity || 0,
      registered: 0,
      imageUrl: getFilePath(req.file),
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// const updateEvent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, date, location, time, description, capacity } = req.body;

//     const event = await Event.findById(id);
//     if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     // Handle image update
//     let imageUrl = event.imageUrl;
//     if (req.file) {
//       // Delete old image if it exists
//       if (event.imageUrl) {
//         const oldImagePath = path.join(__dirname, "../public", event.imageUrl);
//         if (fs.existsSync(oldImagePath)) {
//           fs.unlinkSync(oldImagePath);
//         }
//       }
//       imageUrl = getFilePath(req.file);
//     }

//     const updatedEvent = await Event.findByIdAndUpdate(
//       id,
//       {
//         title,
//         date,
//         location,
//         time,
//         description,
//         capacity,
//         imageUrl,
//       },
//       { new: true }
//     );

//     res.status(200).json(updatedEvent);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, location, time, description, capacity, registered } =
      req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Handle image update
    let imageUrl = event.imageUrl;
    if (req.file) {
      // Delete old image if it exists
      if (event.imageUrl) {
        const oldImagePath = path.join(__dirname, "../public", event.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageUrl = getFilePath(req.file);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        title,
        date,
        location,
        time,
        description,
        capacity,
        registered, // Add this line to update the registered count
        imageUrl,
      },
      { new: true }
    );

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete associated image
    if (event.imageUrl) {
      const imagePath = path.join(__dirname, "../public", event.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Media Controllers (similar pattern as above)
const getMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.status(200).json(media);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createMedia = async (req, res) => {
  try {
    const { title, description, type } = req.body;

    // Validate required fields
    if (!title || !description || !type) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and type are required"
      });
    }

    // Validate file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    // Validate file type matches the selected type
    const isVideo = req.file.mimetype.startsWith('video/');
    const isImage = req.file.mimetype.startsWith('image/');
    
    if ((type === 'video' && !isVideo) || (type === 'image' && !isImage)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type. Expected ${type} but received ${req.file.mimetype}`
      });
    }

    const filePath = getFilePath(req.file);
    
    const newMedia = new Media({
      title,
      description,
      type,
      url: filePath,
      thumbnail: type === "video" ? filePath : null,
    });

    await newMedia.save();
    
    res.status(201).json({
      success: true,
      data: newMedia
    });
  } catch (error) {
    console.error('Error in createMedia:', error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while creating the media"
    });
  }
};
// Add this to your newsController.js
const seedDatabase = async (req, res) => {
  try {
    // Clear existing data
    await Article.deleteMany({});
    await Event.deleteMany({});
    await Media.deleteMany({});

    // Insert test articles (same as above)
    const articles = await Article.insertMany([
      {
        title: "تقرير عن المؤتمر السنوي",
        date: new Date("2025-04-15"),
        summary:
          "ملخص للتقرير السنوي وأهم النقاط التي تمت مناقشتها خلال المؤتمر السنوي للعام 2025",
        imageUrl: "/uploads/article-1.jpg",
        content:
          "محتوى تفصيلي عن المؤتمر السنوي وأهم النقاط التي تمت مناقشتها. يشمل هذا التقرير تفاصيل عن المتحدثين الرئيسيين والموضوعات التي تمت تغطيتها والقرارات المهمة التي تم اتخاذها خلال المؤتمر.",
        author: "محمد عبدالله",
        readTime: "5 دقائق",
        isFeatured: true,
      },
      {
        title: "مقال عن التطورات الأخيرة",
        date: new Date("2025-04-10"),
        summary:
          "نظرة عامة على أحدث التطورات والتغييرات في المجال وتأثيرها على المستقبل",
        imageUrl: "/uploads/article-2.jpg",
        content:
          "تحليل شامل لأحدث التطورات والتغييرات في المجال. يتناول هذا المقال التوجهات الجديدة والتحديات المستقبلية والفرص المتاحة في ظل هذه التطورات المتسارعة.",
        author: "سارة أحمد",
        readTime: "4 دقائق",
        isFeatured: false,
      },
      {
        title: "دراسة تحليلية جديدة",
        date: new Date("2025-04-01"),
        summary:
          "نتائج الدراسة التحليلية الجديدة وتأثيرها على القطاع والتوصيات المقترحة",
        imageUrl: "/uploads/article-3.jpg",
        content:
          "عرض تفصيلي لنتائج الدراسة التحليلية الجديدة وتأثيرها على القطاع. تشمل هذه الدراسة بيانات إحصائية مهمة واستنتاجات رئيسية وتوصيات للتطوير المستقبلي.",
        author: "فاطمة محمود",
        readTime: "7 دقائق",
        isFeatured: true,
      },
    ]);

    // Insert test events (same as above)
    const events = await Event.insertMany([
      {
        title: "المؤتمر السنوي",
        date: new Date("2025-05-20"),
        location: "قاعة المؤتمرات الرئيسية",
        time: "10:00 صباحاً",
        description:
          "انضم إلينا في المؤتمر السنوي لمناقشة أهم المستجدات والتحديات في المجال والاستماع إلى خبراء متخصصين.",
        imageUrl: "/uploads/event-1.jpg",
        capacity: 30,
        registered: 23,
        isFeatured: true,
      },
      {
        title: "ورشة عمل تدريبية",
        date: new Date("2025-05-25"),
        location: "مركز التدريب",
        time: "9:00 صباحاً",
        description:
          "ورشة عمل تدريبية متخصصة لتطوير المهارات المهنية وتعزيز الكفاءات في مجالات متعددة.",
        imageUrl: "/uploads/event-2.jpg",
        capacity: 20,
        registered: 15,
        isFeatured: false,
      },
      {
        title: "لقاء مفتوح مع الخبراء",
        date: new Date("2025-06-05"),
        location: "القاعة الكبرى",
        time: "1:00 ظهراً",
        description:
          "فرصة للتواصل المباشر مع خبراء المجال وطرح الأسئلة والاستفادة من تجاربهم وخبراتهم.",
        imageUrl: "/uploads/event-3.jpg",
        capacity: 50,
        registered: 42,
        isFeatured: true,
      },
    ]);

    // Insert test media (same as above)
    const media = await Media.insertMany([
      {
        title: "صورة من الفعالية السابقة",
        description: "لقطات من الفعالية السابقة التي أقيمت في شهر مارس 2025",
        type: "image",
        url: "/uploads/media-1.jpg",
        thumbnail: null,
      },
      {
        title: "فيديو تعريفي",
        description: "فيديو يستعرض أهم أنشطة وإنجازات العام الماضي",
        type: "video",
        url: "/uploads/video-1.mp4",
        thumbnail: "/uploads/video-thumb-1.jpg",
      },
      {
        title: "معرض الصور",
        description: "صور مختارة من معرض الصور السنوي",
        type: "image",
        url: "/uploads/media-2.jpg",
        thumbnail: null,
      },
    ]);

    res.status(200).json({
      message: "Database seeded successfully",
      articles: articles.length,
      events: events.length,
      media: media.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getArticles,
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getMedia,
  createMedia,
  seedDatabase,
};
