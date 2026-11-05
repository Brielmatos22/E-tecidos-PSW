const jwt = require("jsonwebtoken");

function createToken(user) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET precisa ter pelo menos 32 caracteres.");
  }
  return jwt.sign(
    { sub: user.id, tipo: user.tipo },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "8h" }
  );
}

module.exports = { createToken };
