const mongoose = require("mongoose");
const User = require("../models/user");

async function testFriendship() {
  try {
    // 1️⃣ Create two users
    let user1 = await User.findOne({ username: "userOne" });
    let user2 = await User.findOne({ username: "userTwo" });

    // Connect to MongoDB
    mongoose
      .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/socialDB")
      .then(() => console.log("✅ Connected to MongoDB"))
      .catch((err) => console.error("❌ MongoDB Connection Error:", err));

    // Find existing users or create new users
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
    console.log("Users Created or Found:", user1, user2);

    // 2️⃣ Add user2 as a friend to user1
    user1.friends.push(user2._id);
    await user1.save();

    // 3️⃣ Verify friendship
    const updatedUser1 = await User.findById(user1._id).populate("friends");
    console.log("User1 after adding friend:", updatedUser1);

    // 4️⃣ Remove the friend
    updatedUser1.friends = updatedUser1.friends.filter(
      (friendId) => !friendId.equals(user2._id)
    );
    await updatedUser1.save();

    // 5️⃣ Verify friend removal
    const finalUser1 = await User.findById(user1._id);
    console.log("User1 after removing friend:", finalUser1);

    console.log("✅ Friendship test completed successfully!");
  } catch (error) {
    console.error("❌ Friendship test failed:", error);
  } finally {
    mongoose.connection.close();
  }
}

testFriendship();
