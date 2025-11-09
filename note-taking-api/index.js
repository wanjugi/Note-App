import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import folderRoutes from './routes/folderRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables from .env file
dotenv.config(); 

// Initialize our Express application
const app = express(); 

// --- Middleware ---

// 1. Allow your Nuxt frontend to make requests
app.use(cors({
  origin: [
    'http://localhost:3000',               
    'https://note-app-tau-livid.vercel.app/',
    
  ],
  credentials: true
})); 

// 2. Allow the server to understand JSON data
app.use(express.json()); 

// 3. Now that middleware is set up, define your routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/users', userRoutes);


// Environment Variables
// Get our secret variables from the .env file
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Test Route
app.get('/', (req, res) => {
  res.send('Note App API is running!');
});

// Connect to DB & Start Server
console.log('Attempting to connect to MongoDB...');

mongoose.connect(MONGO_URI)
  .then(() => {
    // This code runs *only if* the database connection is successful
    console.log('✅ Connected to MongoDB');
    
    // Now that we are connected to the DB, we can start our server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    // This code runs *if* the database connection fails
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Exit the application with an error
  });