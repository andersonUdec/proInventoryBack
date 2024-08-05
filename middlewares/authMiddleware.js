const jwt = require("jsonwebtoken");
require('dotenv').config();
const app = require("../app");

const verifyToken = (req, res, next) => {
  try {
    const bearerHeader = req.header('Authorization');
    const parts = bearerHeader.split(' ');
    
    if (parts) {
      if (parts && parts.length === 2) {
        const token = parts[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (decoded) {
            next();
          } else {
            return res.status(401).json({error: "Token invalido"});
          }
        });
      }
    }
  } catch (err) {
    return res.status(403).send({error: "Forbidden"});
  }
};

module.exports = verifyToken;