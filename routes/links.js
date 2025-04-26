import express from 'express';
import Link from '../models/Link.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get all links for the authenticated user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const links = await Link.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(links);
  } catch (error) {
    next(error);
  }
});

// Get a single link
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, userId: req.user.userId });
    
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    res.status(200).json(link);
  } catch (error) {
    next(error);
  }
});

// Create a new link
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { title, url, description, tags } = req.body;
    
    // Create new link
    const link = await Link.create({
      title,
      url,
      description,
      tags: tags || [],
      userId: req.user.userId
    });
    
    res.status(201).json(link);
  } catch (error) {
    // Handle duplicate links
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You already have this link saved' });
    }
    next(error);
  }
});

// Update a link
router.patch('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { title, url, description, tags } = req.body;
    
    // Find and update link
    const link = await Link.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, url, description, tags },
      { new: true, runValidators: true }
    );
    
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    res.status(200).json(link);
  } catch (error) {
    next(error);
  }
});

// Delete a link
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const link = await Link.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    res.status(200).json({ message: 'Link deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;