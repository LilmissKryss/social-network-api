const router = require("express").Router();
const {
  createThought,
  getAllThoughts,
  getThoughtById,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction
} = require("../../controllers/thoughtController");
const auth = require("../../middleware/authMiddleware");

// Public routes
router.route("/").get(getAllThoughts);
router.route("/:id").get(getThoughtById);

// Protected routes
router.route("/").post(auth, createThought);
router.route("/:id").put(auth, updateThought).delete(auth, deleteThought);

// Reaction routes (protected)
router.route("/:thoughtId/reactions").post(auth, createReaction);
router.route("/:thoughtId/reactions/:reactionId").delete(auth, deleteReaction);

module.exports = router; 