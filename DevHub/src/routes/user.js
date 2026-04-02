const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/User");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const userRequests = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "about",
      "skills",
      "photoUrl",
    ]);

    res.json({
      message: "user requests fetched successfully !",
      data: userRequests,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const requests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser, status: "accepted" },
        { toUserId: loggedInUser, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "about",
        "skills",
        "photoUrl",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "about",
        "skills",
        "photoUrl",
      ]);
    const data = requests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "connection requests fetched successfully!!",
      data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      // .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/user/:userId",async(req,res) => {
  try{
    const {userId} =  req.params;

    const user = await User.findById({_id: userId})
    res.send(user)

  }
  catch(err){
     res.status(400).json({ message: err.message });
  }
})
module.exports = userRouter;
