require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

app.use(express.json());
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173", 
  "https://notes-frontend-az0l.onrender.com" 
];

app.use(cors({ origin: allowedOrigins, credentials: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log("MongoDB connection error:", err));

// Routes
app.use('/auth', require('./Routes/authRoutes'));
app.use('/auth/notes', require('./Routes/noteRoutes'));

// Serve static files if in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, 'frontend/dist'); // Ensure this points to the right location
  app.use(express.static(frontendPath)); // Serve static files from 'dist' directory

  // Catch-all route to serve index.html for all other routes
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
