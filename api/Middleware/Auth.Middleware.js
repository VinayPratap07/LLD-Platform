const { verifyToken } = require("../Services/JWT.Auth.Service");

function checkUserForAuthenticaton(cookieName) {
  return (req, res, next) => {
    const cookieValue = req.cookies[cookieName];

    if (!cookieValue) return next();

    try {
      const userPayload = verifyToken(cookieValue);
      req.user = userPayload;
    } catch (error) {
      return next();
    }
    next();
  };
}

//Function to force Authentication
function requireAuthenticaton(req, res, next) {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not logged in" });
  }

  next();
}

module.exports = {
  checkUserForAuthenticaton,
  requireAuthenticaton,
};
