const Thought = require("../models/Thought");
const User = require("../models/user");

const createThought = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id; // Updated from req.userId to req.user.id

    const newThought = new Thought({ text, user: userId });
    await newThought.save();

    await User.findByIdAndUpdate(userId, {
      $push: { thoughts: newThought._id },
    });

    res.status(201).json(newThought);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find().populate("user", "username");
    res.status(200).json(thoughts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getThoughtById = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id).populate(
      "user",
      "username"
    );
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    res.status(200).json(thought);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteThought = async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    await User.findByIdAndUpdate(thought.user, {
      $pull: { thoughts: thought._id },
    });

    res.status(200).json({ message: "Thought deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createThought,
  getAllThoughts,
  getThoughtById,
  deleteThought,
};
