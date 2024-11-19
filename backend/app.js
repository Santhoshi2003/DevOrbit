const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes'); // Adjust the path if necessary
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from 'uploads' directory (for file access)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api', routes);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/form', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Optional: Exit the process if DB connection fails
  });

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
