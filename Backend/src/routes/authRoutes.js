import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs';

const authRouter = express.Router()
const secret = process.env.JWT_SECRET

authRouter.route("/")
.get((req, res) => {
  res.send("All users")
})
.put((req, res)=> {
  res.send("Update users")
})
.delete((req, res) => {
  res.send("Delete users")
})

authRouter.post("/register",async (req, res) => {
  try {
    const user = [];
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userData = {
     ...req.body,
     password: hashedPassword,
    };
    user.push(userData);
    res.status(200).json(user);
   } catch (err) {
    console.log(err.message);
    res.status(500).json({
     message: "Internal error",
    });
   }
})

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
    // Kolla mot db
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