import express from "express";

import authRouter from "./routes/authRoutes.js"
const app = express()
const port = 3004
app.use(express.json())

app.use('/auth', authRouter)

app.get('/', (req, res) => {
  console.log("Start")
  res.status(200).json({message: "Hello World"})
})

app.listen(port, () => {
  console.log(`App listnening on port ${port}`)
})