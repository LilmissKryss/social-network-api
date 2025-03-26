const router = require("express").Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Protected routes
router.route("/profile").get(auth, getUserProfile).put(auth, updateUserProfile);

module.exports = router;
