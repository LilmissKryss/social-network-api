const express = require("express");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/socialDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
});
