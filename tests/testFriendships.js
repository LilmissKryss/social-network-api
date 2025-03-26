const mongoose = require("mongoose");
const User = require("../models/user");

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/socialDB"
    );
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Exit if the connection fails
  }
}

// Friendship test function
async function testFriendship() {
  try {
    console.log("🔄 Running friendship test...");

    // Find or create two users
    let user1 = await User.findOne({ username: "userOne" });
    let user2 = await User.findOne({ username: "userTwo" });

    if (!user1) {
      user1 = await User.create({
        username: "userOne",
        email: "userOne@example.com",
      });
    }
    if (!user2) {
      user2 = await User.create({
        username: "userTwo",
        email: "userTwo@example.com",
      });
    }
    console.log("✅ Users Found/Created:", user1.username, user2.username);

    // Add user2 as a friend to user1
    if (!user1.friends.includes(user2._id)) {
      user1.friends.push(user2._id);
      await user1.save();
      console.log(
        `✅ ${user2.username} added as a friend to ${user1.username}`
      );
    } else {
      console.log(
        `⚠️ ${user1.username} already has ${user2.username} as a friend.`
      );
    }

    // Verify friendship
    const updatedUser1 = await User.findById(user1._id).populate("friends");
    console.log(
      "👥 Friends List:",
      updatedUser1.friends.map((f) => f.username)
    );

    // Remove the friend
    updatedUser1.friends = updatedUser1.friends.filter(
      (friend) => !friend._id.equals(user2._id)
    );
    await updatedUser1.save();
    console.log(
      `❌ ${user2.username} removed from ${user1.username}'s friends list`
    );

    // Verify friend removal
    const finalUser1 = await User.findById(user1._id);
    console.log("✅ Final Friends List:", finalUser1.friends);

    console.log("🎉 Friendship test completed successfully!");
  } catch (error) {
    console.error("❌ Friendship test failed:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Run tests
connectDB().then(testFriendship);
