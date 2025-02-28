const mongoose = require("mongoose");
const path = require("path");

// Debugging Statements to Check File Paths
console.log("Current Directory:", __dirname);
console.log(
  "Resolved Thought Path:",
  path.resolve(__dirname, "../models/thought.js")
);
console.log(
  "Resolved User Path:",
  path.resolve(__dirname, "../models/user.js")
);

// Import Models AFTER Debugging Statements
const Thought = require(path.resolve(__dirname, "../models/thought.js"));
const User = require(path.join(__dirname, "../models/user.js"));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/socialNetworkDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testModels() {
  try {
    const newUser = await User.create({
      username: "testUser",
      email: "test@example.com",
    });
    console.log("User Created:", newUser);

    const newThought = await Thought.create({
      thoughtText: "This is a test thought",
      username: "testUser",
    });
    console.log("Thought Created:", newThought);

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
}

// Run the Test Function
testModels();
