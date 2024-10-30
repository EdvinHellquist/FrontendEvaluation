import express from "express";
import authRouter from "./src/routes/authRoutes.js"
import productRouter from "./src/routes/productRoutes.js";

const app = express()
const port = 3004
app.use(express.json())

app.use('/auth', authRouter)
app.use('/shop', productRouter)

 app.get('/', (req, res) => {
  console.log("Start")
  res.status(200).json({message: "Hello World"})
})

app.get('/', async (req, res) => {
  
});

app.listen(port, () => {
  console.log(`App listnening on port ${port}`)
})