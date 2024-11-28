import express from "express"
import { body, validationResult } from 'express-validator';
import { query } from '../../db.js';
import { isAdmin } from "../rolemethods.js";

const productRouter = express.Router();

productRouter.get('/products', async (req, res) => {
  try {
      const products = await query('SELECT * FROM public.products');
      res.status(200).json(products.rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
  }
});


productRouter.get('/products:id', async (req, res) => {
  const { id } = req.params;

  try {
      const product = await query('SELECT * FROM products WHERE id = $1', [id]);

      if (product.rows.length === 0) {
          return res.status(404).json({ error: 'Product not found' });
      }

      res.status(200).json(product.rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
  }
});


productRouter.put('/products/:id', isAdmin, [
    body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('description').optional().isString().trim().withMessage('Description must be a valid string')
], async (req, res) => {
    const { id } = req.params;
    const { price, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const product = await query(
            `UPDATE products
              SET price = COALESCE($1, price),
                  description = COALESCE($2, description)
              WHERE id = $3
              RETURNING id, price, description`,
            [price, description, id]
        );

        if (product.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: product.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

export default productRouter;