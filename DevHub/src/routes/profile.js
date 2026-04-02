const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditfields } = require("../utils/validations");
const User = require("../models/User");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  const { token } = req.cookies;
  try {
    const { user } = req;
    res.send(user);
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isAllowed = validateEditfields(req);
    if (!isAllowed) {
      throw new Error("Invalid edit Request");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    console.log(loggedInUser);
    
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, profile data edited!`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
    console.log("ERROR: " + err.message);
    
  }
});

module.exports = profileRouter;
