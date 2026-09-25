require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {
  checkUserForAuthenticaton,
  requireAuthenticaton,
} = require("./Middleware/Auth.Middleware");
const { connectDB } = require("./DbConfig/Connect");

//Routes
const UserRoutes = require("./Routes/User.Routes");
const ProblmeRoutes = require("./Routes/Problem.Routes");
const SubmissionRoutes = require("./Routes/Submission.Routes");

const app = express();
const PORT = process.env.PORT;

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkUserForAuthenticaton("token"));
app.use(cors(corsOptions));

app.use("/api/user", UserRoutes);
app.use("/api/problems", ProblmeRoutes);
app.use("/api/submission", requireAuthenticaton, SubmissionRoutes);

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
