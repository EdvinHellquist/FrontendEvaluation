import jwt from "jsonwebtoken"

export const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    console.log("not token");
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      next();
  } catch (err) {
    console.log("catching" + err);
      res.status(403).json({ error: 'Invalid token' });
  }
};