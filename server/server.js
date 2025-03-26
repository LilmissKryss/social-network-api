const express = require("express");
const app = express();
const routes = require("./routes/api");
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

// Start server after database connection 
const startServer = async () => {
  try {
    
    const db = require('./config/connection');
    
   
    await db.once('open', () => {
      console.log('Database connected successfully');
      
      // Start the server
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
