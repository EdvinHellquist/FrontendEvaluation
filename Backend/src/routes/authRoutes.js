import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { query } from '../../db.js';
import { authenticateToken } from "../authmethods.js";

const authRouter = express.Router()
const secret = process.env.JWT_SECRET

authRouter.route("/")
.get(async (req, res) => {
  try {
    const result = await query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})
.delete(async(req, res) => {
  res.send("you sure?")
})

authRouter.put('/update-user', authenticateToken, [
  // Validation checks
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
  const userId = req.user.id;  // Assuming user ID is available from authentication middleware

  try {
      // Optional: Check if new email is already in use by another user
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
               zipcode = COALESCE($3, zipcode),
               city = COALESCE($4, city)
           WHERE id = $5
           RETURNING id, mail, address, zipcode, city`,
          [mail, address, zipcode, city, userId]
      );

      res.status(200).json({ message: 'User updated successfully', user: updatedUser.rows[0] });

  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
  }
});

authRouter.post('/register', [
  // Validation checks
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('mail').isEmail().withMessage('Please enter a valid email.'),
  body('username').trim().notEmpty().withMessage('Username is required.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
  body('address').optional().trim(),
  body('zipcode').optional().isPostalCode('any'),
  body('city').optional().trim(),
], async (req, res) => {
  // Validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { name, mail, username, password, address, zipcode, city, role } = req.body;

  try {
      // Check for existing user
      const userExists = await query(
          'SELECT id FROM users WHERE mail = $1 OR username = $2',
          [mail, username]
      );
      if (userExists.rows.length > 0) {
          return res.status(400).json({ error: 'Email or username already in use.' });
      }
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert user into database
      const newUser = await query(
          `INSERT INTO users (name, mail, username, password, address, zipcode, city, role)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, mail, username, role`,
          [name, mail, username, hashedPassword, address, zipcode, city, role || 'user']
      );
      res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
  }
});


authRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const comparePassword = await bcrypt.compare(
     req.body.password,
     user.password
    );
    if (comparePassword) {
     const token = generateToken(user);
     res.status(200).json({
      token,
      role: user.role,
      id: user.id,
      emailAddress: user.email,
     });
    }
   } catch (err) {
    res.status(500).json({
     message: "An internal error occured",
    });
   }
})

authRouter.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

function generateToken(user) {
  return jwt.sign(
   {
    role: user.role,
    id: user.id,
    email: user.email,
    //Potential additions
    //iat: Math.floor(Date.now() / 1000),
    //iss: 'your-app-name',
   },
   secret,
   {
    algorithm: "HS256",
    expiresIn: "1h",
   }
  );
 }
export default authRouter;