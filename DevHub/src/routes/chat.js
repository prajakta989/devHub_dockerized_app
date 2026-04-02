const express = require('express');
const Chat = require('../models/Chat');
const { userAuth } = require('../middlewares/auth');

const chatRouter = express.Router();

chatRouter.get("/chat/:targetId",userAuth, async(req,res) => {
    const userId = req.user._id;
    const targetId = req.params.targetId
    try{
        let chat = await Chat.findOne({participants:{$all:[userId, targetId]}}).populate({path: "messages.sender", select: "firstName lastName"})

        if(!chat){
            chat = new Chat({
                participants:[userId, targetId],
                messages: [],
            })
        }
        await chat.save()
        res.json(chat)
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})


module.exports = chatRouter;
