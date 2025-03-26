const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/socialDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }
)
.then(() => {
  console.log('Successfully connected to MongoDB.');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Handle connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Handle application termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB connection closure:', err);
    process.exit(1);
  }
});

module.exports = mongoose.connection;
