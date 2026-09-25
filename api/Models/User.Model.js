const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../Services/JWT.Auth.Service");
const { randomBytes, createHmac } = require("crypto");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

//Pre save function that runs when a new user is created
//It is used to hash password and store password and salt in the db
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");

  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
});

userSchema.statics.matchPasswordAndGenerateToken = async function (
  email,
  password,
) {
  const user = await this.findOne({ email });

  if (!user) throw new Error("Invalid credentials");

  //Re-hash password to match with older password
  const userProvidedHash = createHmac("sha256", user.salt)
    .update(password)
    .digest("hex");

  if (userProvidedHash !== user.password)
    throw new Error("Invalid Credentials");

  return createTokenForUser(user);
};

const User = model("user", userSchema);
module.exports = { User };
