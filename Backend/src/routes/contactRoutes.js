
import express from 'express';
import { query } from '../../db.js';

const contactRouter = express.Router();

contactRouter.post('/', async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message are required' });
  }

  try {
    const result = await query(
      'INSERT INTO contacts (email, message, created_at) VALUES ($1, $2, NOW()) RETURNING id',
      [email, message]
    );

    res.status(201).json({ message: 'Message saved', id: result.rows[0].id });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default contactRouter;
