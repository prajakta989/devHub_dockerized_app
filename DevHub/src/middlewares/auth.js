const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userAuth = async(req,res,next) =>{
  try{
    //get the token 
    //validate the token 
    //find the user using that token

    const {token} = req.cookies
    if(!token){
     return res.status(401).send("Please Login !")
    }
    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET)

    const {_id} = decodedObj;

    const user = await User.findById({_id})
    if(!user){
      throw new Error("User does not exists")
    }

    req.user = user;
    next()
  }
  catch(err){
    res.status(400).send("Error: " + err.message)
  }
}

module.exports = {userAuth}