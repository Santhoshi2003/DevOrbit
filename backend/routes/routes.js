const express = require('express');
const { Item } = require('../models/Models'); // Adjust the path to your model file
const multer = require('multer');

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure 'uploads/' directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// CREATE: Add new item
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

// READ: Get all items
router.get('/submissions', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Failed to fetch items', error });
  }
});

// READ: Get a single item by ID
router.get('/submissions/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Failed to fetch item', error });
  }
});

// UPDATE: Update an existing item by ID
router.put('/update-item/:id', upload.single('file'), async (req, res) => {
  try {
    const { type, title, description, startDate, endDate, questions } = req.body;
    const updatedData = {
      type,
      title,
      description,
      startDate,
      endDate,
      questions: questions ? JSON.parse(questions) : []
    };
    
    if (req.file) {
      updatedData.file = req.file.path;
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item updated successfully!', data: updatedItem });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Failed to update item', error });
  }
});

// DELETE: Delete an item by ID
router.delete('/delete-item/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully!' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Failed to delete item', error });
  }
});

module.exports = router;
