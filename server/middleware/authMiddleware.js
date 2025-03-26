const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  console.log('Auth Headers:', req.headers);
  
  // Get token from header
  const authHeader = req.header("Authorization");
  console.log('Authorization Header:', authHeader);

  // Check if no auth header
  if (!authHeader) {
    console.log('No Authorization header found');
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Check if Bearer token
  if (!authHeader.startsWith("Bearer ")) {
    console.log('Invalid token format - does not start with Bearer');
    return res.status(401).json({ message: "Invalid token format" });
  }

  // Get token from Bearer string
  const token = authHeader.split(" ")[1];
  console.log('Extracted token:', token?.substring(0, 20) + '...');

  // Check if no token
  if (!token) {
    console.log('No token found after Bearer');
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-key-here');
    console.log('Token verified successfully:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: "Token is not valid" });
  }
};
