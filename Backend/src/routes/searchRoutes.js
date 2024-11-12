import express from 'express';
import { query } from '../../db.js';

const searchRouter = express.Router();

searchRouter.route("/")
.get( async (req, res) => {
  const searchWord = req.query.q;
  if (!searchWord) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  try {
    const result = await query(
      `SELECT * FROM products 
       WHERE name ILIKE $1 OR color ILIKE $1 OR description ILIKE $1`,
      [`%${searchWord}%`]
    );

    res.status(200).json({ products: result.rows });
  } catch (err) {
    console.error('Error executing search query:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default searchRouter;
