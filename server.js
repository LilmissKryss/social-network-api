const express = require("express");
const app = express();
const routes = require("./routes/api");

app.use(express.json());
app.use("/api", routes); // Use the main router which handles the /users and /thoughts routes

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
