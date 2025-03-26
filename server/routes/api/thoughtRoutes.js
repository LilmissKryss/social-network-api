const router = require("express").Router();
const {
  createThought,
  getAllThoughts,
  getThoughtById,
  deleteThought,
} = require("../../controllers/thoughtController");
const auth = require("../../middleware/authMiddleware");

// Public routes
router.route("/").get(getAllThoughts);
router.route("/:id").get(getThoughtById);

// Protected routes
router.route("/").post(auth, createThought);
router.route("/:id").delete(auth, deleteThought);

module.exports = router; 