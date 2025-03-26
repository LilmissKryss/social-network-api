const User = require("../models/user");
const Thought = require("../models/Thought");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-__v")
      .populate("thoughts")
      .populate("friends");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single user by ID with populated thought and friend data
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-__v")
      .populate("thoughts")
      .populate("friends");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user by ID
const updateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const updateData = { username, email };

    // Only update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete user and associated thoughts
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all thoughts associated with the user
    await Thought.deleteMany({ _id: { $in: user.thoughts } });

    // Remove user from friends lists of other users
    await User.updateMany(
      { friends: req.params.id },
      { $pull: { friends: req.params.id } }
    );

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "User and associated thoughts deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add friend to user's friend list
const addFriend = async (req, res) => {
  try {
    // Check if friend exists
    const friend = await User.findById(req.params.friendId);
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    // Add friend to user's friend list and user to friend's friend list
    const [user, updatedFriend] = await Promise.all([
      User.findByIdAndUpdate(
        req.params.userId,
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      ).populate('friends'),
      User.findByIdAndUpdate(
        req.params.friendId,
        { $addToSet: { friends: req.params.userId } },
        { new: true }
      )
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Friend added successfully",
      user
    });
  } catch (error) {
    console.error('Add friend error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove friend from user's friend list
const removeFriend = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    ).populate("friends");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Register new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();
    
    // Create token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || 'your-super-secret-key-here',
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Debug 
    console.log('Login attempt:', {
      email,
      hasPassword: !!user.password,
      passwordLength: user.password?.length
    });

    // Check password
    if (!user.password) {
      console.error('User found but no password hash exists');
      return res.status(500).json({ message: "Server error: User password not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-super-secret-key-here',
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    // Find user & update profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
