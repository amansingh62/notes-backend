require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173", 
  "https://notes-frontend-az0l.onrender.com" 
];

app.use(cors({ origin: allowedOrigins, credentials: true }));

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log("MongoDB connection error:", err));

app.use('/auth', require('./Routes/authRoutes'));
app.use('/auth/notes', require('./Routes/noteRoutes'));

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
