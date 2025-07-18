const Program = require("../models/programModel");
const Event = require("../models/Event");
const SuccessStory = require("../models/SuccessStorymodels");


exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find();      
    res.status(200).json(programs);            
  } catch (err) {
    console.error("Error fetching programs:", err);
    res.status(500).json({ error: "Server error" });
  }
};



exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 }); 
    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Server error" });
  }
};




exports.getAllSuccessStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find().sort({ createdAt: -1 });
    res.status(200).json(stories);
  } catch (err) {
    console.error("Error fetching success stories:", err);
    res.status(500).json({ message: "Server error" });
  }
};


