// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || "super_secret_key";

// const authMiddleware = (req) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     throw new Error("Unauthorized: No token provided");
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     return decoded; // Attach user details to context
//   } catch (error) {
//     throw new Error("Unauthorized: Invalid token");
//   }
// };

// module.exports = authMiddleware;
