const { User } = require("../Models/User.Model");

async function createUser(req, res) {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(422).json({
      message: "All fields are required",
    });
  }

  try {
    const user = await User.create({
      fullName,
      email,
      password,
    });

    return res
      .status(201)
      .json({ Message: "User created successfully", userId: user._id });
  } catch (error) {
    console.log(error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];

      return res.status(409).json({
        message: `${field} already exists`,
      });
    }

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ Message: "Both fields are required" });
  }
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({ message: "User logged in" });
  } catch (error) {
    return res.status(401).json({ message: error.message, type: "error" });
  }
}

async function getUserProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password -salt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function logoutUser(req, res) {
  const user = req.user.id;

  if (!user) return res.json({ message: "User already logged Out" });

  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "User Logged out" });
  } catch (error) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = { createUser, loginUser, getUserProfile, logoutUser };
