import User from "../database/jobSchema.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";
import { randomTokenGen } from "../middleware/randomTokenGen.js";
import { forgotPasswordMail, resetPasswordMail, verificationMail } from "../Mail/mail.js";
import { setCookiesAndToken } from "../middleware/jwtAuth.js";

dotenv.config()
export const Signup = async (req, res) => {
  const { userName, email, password } = req.body;
  console.log("userName", userName, "email", email, "password", password);
  try {
    const Exist = await User.findOne({ email }).select("-password");

    const usernameExist = await User.findOne({ username: userName })
    if (usernameExist) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if ((!userName, !email, !password)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (Exist) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hasedPassword = await bcrypt.hash(password, 10);
    const Token = randomTokenGen().toString();
    console.log(Token);

    const savedUser = await User.create({
      username: userName, // Match the schema field name
      email,
      password: hasedPassword,
      verificationToken: Token,
      verificationTokenExpireAt: Date.now() +60*60*1000 // 1 hour
    });
    await savedUser.save();

    const convertToLocalDate = new Date(
      savedUser.verificationTokenExpireAt
    ).toLocaleString("default", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const Time=new Date(savedUser.verificationTokenExpireAt).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    })
    console.log("Time", Time);
    console.log("convertToLocalTime", convertToLocalDate);

    verificationMail(savedUser.email, Token,convertToLocalDate,Time);

    res.status(200).json({
      message: "User Created Successfully",
      user: {
        ...savedUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verification=async(req,res)=>{

    const {token}=req.body
    try {
        const exist=await User.findOne({verificationToken:token,verificationTokenExpireAt:{$gt:Date.now()}})

        if(!exist){
            res.status(400).json({message:"Invalid Token || Token Expired"})
        }
        exist.isVerified=true
        exist.verificationToken=undefined
        exist.verificationTokenExpireAt=undefined

        await exist.save()

        res.status(200).json({message:"Email Verified",user:{...exist._doc,password:undefined}})
    }
    catch{

    }
}

export const Signin=async(req,res)=>{

    const {email,password}=req.body
    try {
        const exist=await User.findOne({email})

        if(!email,!password){
            return res.status(400).json({message:"All fields are required"})
        }

        if(!exist){
            return res.status(400).json({message:"User Not Exist"})
        }
        const decode=await bcrypt.compare(password,exist.password)
        if(!decode){
            return res.status(400).json({message:"Incorrect Password"})
        }
        exist.lastLogin=Date.now()
        await exist.save()

        await setCookiesAndToken(res, { userId: exist.id })
        return res.status(200).json({message:"Login Successfully",user:{...exist._doc,password:undefined}})

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
export const forgotPassword=async(req,res)=>{
    const {email}=req.body
    console.log("email",email)
    try {
        const exist=await User.findOne({email})
        if(!exist){
            res.status(400).json({message:"User Not Exist"})
        }
        const resetToken=await crypto.randomBytes(20).toString("hex")
        const resetTokenExipresAt=Date.now()+60*60*1000// 1 hour
        exist.resetPasswordToken=resetToken
        exist.resetPasswordExpire=resetTokenExipresAt
        await exist.save()

        const DateFormat=new Date(exist.resetPasswordExpire).toLocaleString("en-US",{
            day:"2-digit",
            month:"2-digit",
            year:"2-digit",
        })
        const timeFormat=new Date(exist.resetPasswordExpire).toLocaleString("en-US",{
            hour:"numeric",
            minute:"numeric",
            second:"numeric",
        })

        const resetUrl=`${process.env.CLIENT_URL}/reset-password/${resetToken}`
        await forgotPasswordMail(exist.email,resetUrl,DateFormat,timeFormat)

        res.status(200).json({message:`Reset Password Link Sent To : ${exist.email}`,sucess:true})

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
export const resetPassword=async(req,res)=>{
    const {token}=req.params
    const {password}=req.body


    console.log("token",token,"password",password)

    try {
      if(!password){
        return res.status(400).json({message:"Password is required"})
      }
        const exist=await User.findOne({
            resetPasswordToken:token,
            resetPasswordExpire:{$gt:Date.now()}
        })
        if(!exist){
           return res.status(400).json({message:"Invalid Token || Token Expired"})
        }
        const encode=await bcrypt.hash(password,10)
        exist.password=encode
        exist.resetPasswordToken=undefined
        exist.resetPasswordExpire=undefined
        await exist.save()

        await resetPasswordMail(exist.email)

        return res.status(200).json({message:"Password Reset Successfully"})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    
}

export const checkEmailAvailability = async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    
    try {
        // Check if email is valid format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                available: false,
                message: "Invalid email format" 
            });
        }
        
        // Check if email exists in database
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(200).json({ 
                available: false,
                message: "Email is already registered" 
            });
        }
        
        return res.status(200).json({ 
            available: true,
            message: "Email is available" 
        });
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const authUser=async(req,res)=>{
  console.log(req.user)
  try {
    const user=await User.findById(req.user._id)
    if(!user){
        return res.status(404).json({message:"User Not Found"})
    }
    return res.status(200).json({user:{...user._doc,password:undefined}})
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
    
  }
}
export const logout = async (req, res) => {
  try {
    const cookie = req.cookies.auth;
    console.log("cookie from Logout", cookie);

    localStorage.clear();
    cookie.clear();

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePassword=async(req,res)=>{
  const {password}=req.body
  try {
    const exist=await User.findById(req.user._id)
    if(!exist){
      return res.status(400).json({message:"User Not Found"})
    }
    if(!password){
      return res.status(400).json({message:"Password is required"})
    }
    const encode=await bcrypt.hash(password,10)
    exist.password=encode
    await exist.save()
    return res.status(200).json({message:"Password Updated Successfully"})
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export const updateProfile=async(req,res)=>{
  const {profileImage}=req.file
  try {
    const exist=await User.findById(req.user._id)
    if(!exist){
      return res.status(400).json({message:"User Not Found"})
    }
    if(!profileImage){
      return res.status(400).json({message:"Profile Image is required"})
    }
    exist.profilePicture=profileImage.filename
    await exist.save()
    return res.status(200).json({message:"Profile Updated Successfully"})
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
