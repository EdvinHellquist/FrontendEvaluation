import express from "express";
import authRouter from "./src/routes/authRoutes.js"
import productRouter from "./src/routes/productRoutes.js";
import cors from 'cors'

const app = express()
const port = 3004
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use('/auth', authRouter)
app.use('/shop', productRouter)

app.get('/', (req, res) => {
  console.log("Start")
  res.status(200).json({message: "Hello World"})
})

app.listen(port, () => {
  console.log(`App listnening on port ${port}`)
})