const router = require("express").Router();
const {
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
} = require("../../controllers/userController");
const auth = require("../../middleware/authMiddleware");

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// User routes (protected)
router.route("/")
  .get(auth, getAllUsers)
  .post(createUser);

router.route("/:id")
  .get(auth, getUserById)
  .put(auth, updateUser)
  .delete(auth, deleteUser);

// Friend routes (protected)
router.route("/:userId/friends/:friendId")
  .post(auth, addFriend)
  .delete(auth, removeFriend);

// Profile routes (protected)
router.route("/profile")
  .get(auth, getUserProfile)
  .put(auth, updateUserProfile);

module.exports = router;