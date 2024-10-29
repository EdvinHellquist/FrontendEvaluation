import express from "express";
import { query } from './db.js';
import authRouter from "./src/routes/authRoutes.js"

const app = express()
const port = 3004
app.use(express.json())

app.use('/auth', authRouter)

/* app.get('/', (req, res) => {
  console.log("Start")
  res.status(200).json({message: "Hello World"})
}) */

app.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`App listnening on port ${port}`)
})