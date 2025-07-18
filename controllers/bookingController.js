const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
  try {
    const { hallId, hallName, fullName, phone, email, date, time, notes } =
      req.body;

    // Check for existing booking
    const existingBooking = await Booking.findOne({ hallId, date, time });
    if (existingBooking) {
      return res.status(400).json({ message: "الوقت المحدد محجوز مسبقًا." });
    }

    const booking = new Booking({
      hallId,
      hallName,
      fullName,
      phone,
      email,
      date,
      time,
      notes,
    });

    await booking.save();
    res.status(201).json({ message: "تم إنشاء الحجز بنجاح." });
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم.", error });
  }
};

exports.getBookedTimes = async (req, res) => {
  try {
    const bookings = await Booking.find();
    const bookedTimes = {};

    bookings.forEach((booking) => {
      if (!bookedTimes[booking.hallId]) {
        bookedTimes[booking.hallId] = {};
      }
      if (!bookedTimes[booking.hallId][booking.date]) {
        bookedTimes[booking.hallId][booking.date] = [];
      }
      bookedTimes[booking.hallId][booking.date].push(booking.time);
    });

    res.status(200).json(bookedTimes);
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم.", error });
  }
};

//ali addition
exports.getUniqueHalls = async (req, res) => {
  try {
    const halls = await Booking.aggregate([
      {
        $group: {
          _id: "$hallId",
          name: { $first: "$hallName" },
        },
      },
      {
        $project: {
          hallId: "$_id",
          name: 1,
          _id: 0,
        },
      },
      {
        $sort: { hallId: 1 },
      },
    ]);

    res.status(200).json(halls);
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم.", error });
  }
};
exports.getAllBookings = async (req, res) => {
  try {
    const { hallId, date, search } = req.query;
    let query = {};

    if (hallId) query.hallId = hallId;
    if (date) query.date = date;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم.", error });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    res.status(200).json({ message: "تم حذف الحجز بنجاح." });
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم.", error });
  }
};
