const express = require('express');
const { Item } = require('../models/Models'); // Adjust the path to your model file
const multer = require('multer');

const router = express.Router();

// File storage setup using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure you have an 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// POST Route: Add new item
router.post('/add-item', upload.single('file'), async (req, res) => {
  try {
    const { type, title, description, startDate, endDate, questions } = req.body;
    const newItem = new Item({
      type,
      title,
      description,
      startDate,
      endDate,
      file: req.file ? req.file.path : null,
      questions: questions ? JSON.parse(questions) : []
    });

    await newItem.save();
    res.status(201).json({ message: 'Item added successfully!', data: newItem });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ message: 'Failed to add item', error });
  }
});

// GET Route: Get all stored items
router.get('/submissions', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Failed to fetch items', error });
  }
});

module.exports = router;
