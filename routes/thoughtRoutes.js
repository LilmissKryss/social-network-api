const router = require("express").Router();
const {
  createThought,
  getAllThoughts,
  getThoughtById,
  deleteThought,
} = require("../../controllers/thoughtController");
const auth = require("../../middleware/auth");

// Public route
router.get("/", getAllThoughts);

// Protected routes
router.post("/", auth, createThought); // Needs auth to get user ID

// Some routes may need auth depending on your requirements
router.route("/:id").get(getThoughtById).delete(auth, deleteThought); // May need auth to verify the user owns the thought

module.exports = router;
