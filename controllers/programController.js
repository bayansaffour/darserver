// import Program from "../models/programModel.js";

// // جلب البرامج حسب الفئة أو البحث
// export const getPrograms = async (req, res) => {
//   try {
//     const { category, search } = req.query;

//     let query = {};
//     if (category) query.category = category;
//     if (search) query.name = { $regex: search, $options: "i" };

//     const programs = await Program.find(query);
//     res.json(programs);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // جلب جميع الفئات المتوفرة
// export const getCategories = async (req, res) => {
//   try {
//     const categories = await Program.distinct("category");
//     res.json(categories);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
////////////////////////Ali edition

// programsController.js
import Program from "../models/programModel.js";

// Get all programs
export const getPrograms = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isDeleted: { $ne: true } }; // Exclude soft-deleted

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };

    const programs = await Program.find(query);
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Program.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new program
export const createProgram = async (req, res) => {
  try {
    const program = new Program(req.body);
    await program.save();
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update program
export const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProgram = await Program.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedProgram);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Soft delete program
export const softDeleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    await Program.findByIdAndUpdate(id, { isDeleted: true });
    res.json({ message: "Program soft deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Restore program
export const restoreProgram = async (req, res) => {
  try {
    const { id } = req.params;
    await Program.findByIdAndUpdate(id, { isDeleted: false });
    res.json({ message: "Program restored" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Permanent delete
export const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    await Program.findByIdAndDelete(id);
    res.json({ message: "Program permanently deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
