const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      match: /^[A-Za-z\s'-]+$/,
      minLength: 3,
      maxLength: 255,
    },
    lastName: {
      type: String,
      match: /^[A-Za-z\s'-]+$/,
      minLength: 3,
      maxLength: 255,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      // validate: [
      //   {
      //     validator: async function (value) {
      //       const count = await mongoose.models.User.countDocuments({
      //         emailId: value,
      //       });
      //       return count === 0;
      //     },
      //     message: (props) => `${props.value} already exists!`,
      //   },
      //   {
      //     validator: validator.isEmail,
      //     message: 'Invalid email format',
      //   },
      // ],
      index: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      // validate: {
      //   validator: function(value){
      //     return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
      //   },
      //   message: "Password must be at least 8 characters long and include uppercase, number, and special character."
      // }
    },
    age: {
      type: Number,
      min: 18,
      max: 90,
    },
    gender: {
      type: String,
      enum:{
        values: ['male','female','others'],
        message: `{VALUE} is incorrect gender type`
      }
    },
    photoUrl: {
      type: String,
      default: "https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg",
      validate:{
          validator: validator.isURL,
          message: 'Invalid URL format',
      }
    },
    about: {
      type: String,
      default: "This is default about information about the user",
    },
    skills: {
      type: [String],
    },
    resetPasswordToken :{
      type: String
      // default: undefined
    },
    resetPasswordExpires :{
      type: Date
      // default: undefined
    }
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function (){
  const user = this;
  const token = jwt.sign({ _id: user._id }, "dev@hub0512", {expiresIn: "7d"});
  return token;
}

userSchema.methods.validatePassword = async function (passwordinputByuser){
  const user = this;
  const passwordHash =  user.password
  const isPasswordValid = await bcrypt.compare(passwordinputByuser,passwordHash);
  return isPasswordValid
}

const User = mongoose.model("User", userSchema);
module.exports = User;
