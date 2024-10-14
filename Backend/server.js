import express from "express";
import authRoutes from "./routes/authRoutes"
const app = express()

app.use('/auth/', authRoutes)

app.get('/', (req, res) => {
  console.log("Start")
  res.status(200).json({message: "Hello World"})
})




app.listen(3000)