const mongoose = require('mongoose');

// Unified Schema for handling Projects, Tasks, and Quizzes
const formSchema = new mongoose.Schema({
    type: { 
        type: String, 
        required: true, 
        enum: ['Project', 'Task', 'Quiz'] // Restricts type to one of these values
    },
    title: { type: String, required: true },
    description: { 
        type: String, 
        required: function() { return this.type !== 'Quiz'; } // Only required if type is not Quiz
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    filePath: { type: String }, // Optional field for file uploads
    questions: [
        {
            question: { type: String, required: function() { return this.type === 'Quiz'; } }, // Required only for Quiz
            options: [{ type: String }], // Array of options
            correctAnswer: { type: String }
        }
    ] // Only relevant for Quiz type
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Create the Model
const Item = mongoose.model('Item', formSchema);

module.exports = { Item };
