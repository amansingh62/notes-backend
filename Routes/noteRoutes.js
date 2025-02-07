const express = require('express');
const Note = require('../models/Note');
const authMiddleware = require('../Middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, async(req, res) => {
    try {
        const { title, content } = req.body;
        const newNote = await Note.create({ user: req.userId, title, content });
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        console.log("User ID from middleware:", req.userId);  // Log the userId to verify
        const notes = await Note.find({ user: req.userId });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.userId });
        if (!note) {
            console.log("Note not found for this user!");
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        console.error("Error fetching note:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

router.put('/:id', authMiddleware, async(req, res) => { // FIXED: "/" before ":id"
    try {
        const { title, content } = req.body;
        const updatedNote = await Note.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            { title, content },
            { new: true }
        );
        if (!updatedNote) return res.status(404).json({ message: 'Note not found' });
        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

router.delete('/:id', authMiddleware, async(req, res) => { // FIXED: "/" before ":id"
    try {
        const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!deletedNote) return res.status(404).json({ message: 'Note not found' });
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
