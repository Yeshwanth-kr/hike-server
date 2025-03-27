import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ error: "You are not authenticated" });
  } else {
    jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
      if (err) {
        return res.status(403).json({ error: "Invalid Token" });
      } else {
        req._id = payload._id;
        next();
      }
    });
  }
};
