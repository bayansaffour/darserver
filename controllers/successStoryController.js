import SuccessStory from "../models/SuccessStorymodels.js";

// Get all stories
export const getSuccessStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new story
export const createSuccessStory = async (req, res) => {
  try {
    const { name, imageUrl, shortStory, videoUrl } = req.body;
    const newStory = new SuccessStory({ name, imageUrl, shortStory, videoUrl });
    await newStory.save();
    res.status(201).json(newStory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete story
export const deleteSuccessStory = async (req, res) => {
  try {
    const { id } = req.params;
    await SuccessStory.findByIdAndDelete(id);
    res.json({ message: "Success story deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//////////////////////////////////////////Ali addition
// Update story
export const updateSuccessStory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStory = await SuccessStory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedStory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Soft delete story
export const softDeleteSuccessStory = async (req, res) => {
  try {
    const { id } = req.params;
    await SuccessStory.findByIdAndUpdate(id, { isDeleted: true });
    res.json({ message: "Success story soft deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Restore soft deleted story
export const restoreSuccessStory = async (req, res) => {
  try {
    const { id } = req.params;
    await SuccessStory.findByIdAndUpdate(id, { isDeleted: false });
    res.json({ message: "Success story restored" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
