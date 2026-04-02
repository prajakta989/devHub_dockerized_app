const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail")

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {
  try{
    const fromUserId = req.user._id;
    const toUserId = req.params.userId;
    const status = req.params.status

    const allowedStatus = ['interested', 'ignored'];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({
        message: "Invalid status type"
      })
    }

    const toUserExists = await User.findById({_id:toUserId})
    if(!toUserExists){
      return res.status(400).json({
        message: "User does not exists"
      })
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or:[
        {fromUserId, toUserId},
        {fromUserId:toUserId, toUserId:fromUserId}
      ]
    })

    if(existingRequest){
      return res.status(400).json({
        message: "Connection request already exists"
      })
    }


    const request = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    })

    const data = await request.save()
    // const sendMail = await sendEmail.run();
    // console.log(sendMail);
    
    res.json({
      message: `${status === 'interested'? "Connection request sent":"Connection request ignored"
      }`,
      data
    })
  }
  catch(err){
    res.status(400).send("ERROR: " + err.message)
  }
  
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res) =>{
  try{
    const {status, requestId}  = req.params;

    const loggedinUser = req.user._id

    const allowedStatus = ["accepted", "rejected"];
    //validate status
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message: "Status not allowed"});
    }

    //validate 1)requestId is valid  2) touser should be loggedin  3)status should be interested

    const request  = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId:loggedinUser,
      status:"interested"
    })

    if(!request){
      return res.status(404).json({
        message: "Connection request not found"
      })
    }

    request.status = status;

    const data = await request.save()
    res.status(200).json({
      message:`connection request ${status}`,
      data
    })
  }
  catch(err){
    res.status(400).send("ERROR: " + err.message)
  }
})

module.exports = requestRouter;
