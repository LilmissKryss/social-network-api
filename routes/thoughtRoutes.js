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
router.post("/", auth, createThought);

// Some routes may need auth depending on your requirements
router.route("/:id").get(getThoughtById).delete(auth, deleteThought);

module.exports = router;
