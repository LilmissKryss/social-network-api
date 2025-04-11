const mongoose = require("mongoose");
const path = require("path");
const { set } = require("../models/reaction");

// Import Models
const Thought = require(path.resolve(__dirname, "../models/thought.js"));
const User = require(path.join(__dirname, "../models/user.js"));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/socialDB");

function setUp() {
  // set hardcoded mock data for testing
}

async function testModels() {
  try {
    // Find existing user or create a new user
    const newUser = await User.findOneAndUpdate({
      username: "testUser",
      email: "test@example.com",
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    console.log("User Found or Created:", newUser);

    // Create a new thought and link to user
    const newThought = await Thought.create({
      thoughtText: "This is a test thought",
      username: newUser.username,
    });
    console.log("Thought Created:", newThought);

    // Find user and populate thoughts
    newUser.thoughts.push(newThought._id);
    await newUser.save();
    console.log(
      "User Updated with Thought:",
      await User.findById(newUser._id).populate("thoughts")
    );

    // Add a reaction to the thought
    const reaction = {
      reactionBody: "Great thought!",
      username: "anotherUser",
    };
    const updatedThought = await Thought.findByIdAndUpdate(
      newThought._id,
      { $push: { reactions: reaction } },
      { new: true }
    );
    console.log("Updated Thought with Reaction:", updatedThought);

    // Remove the reaction
    const cleanedThought = await Thought.findByIdAndUpdate(
      newThought._id,
      { $pull: { reactions: { reactionBody: "Great thought!" } } },
      { new: true }
    );
    console.log("Thought After Reaction Removal:", cleanedThought);

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
}

function tearDown() {
  // remove mock data
}

// Run the Test Function
testModels();
