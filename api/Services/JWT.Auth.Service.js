const JWT = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET_KEY;
function createTokenForUser(user) {
  const payload = {
    id: user._id,
    email: user.email,
  };

  const token = JWT.sign(payload, SECRET, { expiresIn: "7d" });

  return token;
}

function verifyToken(token) {
  const payload = JWT.verify(token, SECRET);

  return payload;
}

module.exports = { verifyToken, createTokenForUser };
