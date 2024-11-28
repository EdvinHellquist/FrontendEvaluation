import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs';
import { body, check, validationResult } from 'express-validator';
import { query } from '../../db.js';
import { authenticateToken } from "../authmethods.js";
import 'dotenv/config'

const authRouter = express.Router()
const secret = process.env.JWT_SECRET

authRouter.put('/update-user', authenticateToken, [
  body('mail').optional().isEmail().withMessage('Please enter a valid email.'),
  body('address').optional().trim(),
  body('zipcode').optional().isPostalCode('any').withMessage('Please enter a valid postal code.'),
  body('city').optional().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  const { mail, address, zipcode, city } = req.body;
  const userId = req.user.id;
  try {
      if (mail) {
          const emailExists = await query(
              'SELECT id FROM users WHERE mail = $1 AND id != $2',
              [mail, userId]
          );
          if (emailExists.rows.length > 0) {
              return res.status(400).json({ error: 'Email is already in use by another account.' });
          }
      }
      // Update the user's information
      const updatedUser = await query(
          `UPDATE users
           SET mail = COALESCE($1, mail),
               address = COALESCE($2, address),
               zip_code = COALESCE($3, zip_code),
               city = COALESCE($4, city)
           WHERE id = $5
           RETURNING id, mail, address, zip_code, city`,
          [mail, address, zipcode, city, userId]
      );
      if (updatedUser.rows.length === 0) {
        console.error('No rows updated. Ensure the userId is correct.');
        return res.status(404).json({ error: 'User not found or no changes made' });
      }
      res.status(200).json({ message: 'User updated successfully', user: updatedUser.rows[0] });

  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
  }
});

authRouter.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('mail').isEmail().withMessage('Please enter a valid email.'),
  body('username').trim().notEmpty().withMessage('Username is required.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
  body('address').optional().trim(),
  body('zipcode').optional().isPostalCode('any'),
  body('city').optional().trim(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }

  const { name, mail, username, password, address, zipcode, city, role } = req.body;

  try {
      const userExists = await query(
          'SELECT id FROM users WHERE mail = $1 OR username = $2',
          [mail, username]
      );
      if (userExists.rows.length > 0) {
          return res.status(400).json({ error: 'Email or username already in use.' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await query(
          `INSERT INTO users (name, mail, username, password, address, zip_code, city, role)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, mail, username, role`,
          [name, mail, username, hashedPassword, address, zipcode, city, role || 'user']
      );
      res.status(201).json({ message: 'User registered successfully', user: newUser});
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
  }
});


authRouter.post("/login", async (req, res) => {
  try {
    const { mail } = req.body;
    const result = await query('SELECT * FROM users WHERE mail = $1', [mail]);
    if (result.rowCount == 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const { id, address, zip_code, city, role, password } = result.rows[0];
    const comparePassword = await bcrypt.compare(
     req.body.password,
     password
    );
    if (comparePassword) {
     const token = generateToken(id, role, mail);
     res.status(200).json({
      token: token,
      role: role,
      id: id,
      mail: mail,
      address: address,
      zipcode: zip_code,
      city: city
     });
    }
   } catch (err) {
    console.error(err)
    res.status(500).json({
     message: "An internal error occured",
    });
   }
})

authRouter.delete('/delete', async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  try {
    const result = await query('DELETE FROM users WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'An error occurred while deleting the user' });
  }
});

authRouter.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

function generateToken(id, role, mail) {
  return jwt.sign(
   {
    role: role,
    id: id,
    email: mail,
   },
   secret,
   {
    expiresIn: "1h",
   }
  );
 }
export default authRouter;