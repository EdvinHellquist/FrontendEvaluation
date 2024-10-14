import express from "express"
const router = express.Router()

router.route("/")
.get((req, res) => {
  res.send("All users")
})
.put((req, res)=> {
  res.send("Update users")
})
.delete((req, res) => {
  res.send("Delete users")
})

export default router;