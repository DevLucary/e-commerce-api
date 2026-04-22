const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
    let authHeader = req.headers.authorization
   
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided or malformed header"
      })
    }
    
    const token = authHeader.substring(7);
   
   try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
   
    req.userId = decoded.id
    
    next()
  } catch (error) {
    let message = "Invalid or expired token";
    if (error.name === "TokenExpiredError") {
      message = "Token expired. Please log in again.";
    }
    return res.status(401).json({ error: message });
  }
}

module.exports = {
  authMiddleware
}