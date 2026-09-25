const { Router } = require("express");
const {
  createUser,
  loginUser,
  getUserProfile,
  logoutUser,
} = require("../Controllers/User.Controller");
const { requireAuthenticaton } = require("../Middleware/Auth.Middleware");

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/me", requireAuthenticaton, getUserProfile);
router.get("/logout", logoutUser);

module.exports = router;
