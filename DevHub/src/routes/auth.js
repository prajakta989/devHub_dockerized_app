const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const validator = require("validator");
const { validateSignupData } = require("../utils/validations");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    //validate req.body data
    validateSignupData(req);
    const { firstName, lastName, emailId, password, age, gender, photoUrl } =
      req.body;
    //hash password
    const passwordHash = await bcrypt.hash(password, 10);
    //creates new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      photoUrl,
    });
    //put it in try catch block whenever interacting with database
    const userdata = await user.save();
    const token = await user.getJWT();
    const cookie = res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
    });
    res.json({ message: "user created successfully", data: userdata });
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    if (!emailId) {
      throw new Error("Email is required");
    }

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid Email Id");
    }
    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    //validatePassword is a user specifis method that is why it is written under userSchema in User.js file
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //getJWT is a user specifis method thta is why it is written under userSchema in User.js file
      const token = await user.getJWT();
      const cookie = res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      });
      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Successfully!!");
});

authRouter.post("/forgot-password", async (req, res) => {
  try {
    const { emailId } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid Email Id");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User does not exixts");
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // You'd send this URL via email in a real app
    const resetLink = `https://yourfrontend.com/reset-password?token=${rawToken}`;

    console.log("Reset link:", resetLink); // for now
    res.status(200).send("Password reset link sent to your email");
  } catch (err) {
    res.status(400).send("Something went wrong:" + err.message);
  }
});

authRouter.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    console.log(token, newPassword);

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }

    //  Validate password complexity
    const isValidPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
      newPassword
    );
    if (!isValidPassword) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters, one uppercase letter, one number, and one special character.",
      });
    }
    // Hash the token to compare with stored one
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    // Find user with matching token and check if not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token is invalid or has expired" });
    }

    // Set new password (it will be hashed in the pre-save hook)
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
});
module.exports = authRouter;
