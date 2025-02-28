const router = require("express").Router();
const userRoutes = require("./userRoutes");
const thoughtRoutes = require("./thoughtRoutes");

router.use("/users", userRoutes);
router.use("/thoughts", thoughtRoutes);

// API checks for working status
router.get("/", (req, res) => {
  res.send("API is working!");
});

module.exports = router;
