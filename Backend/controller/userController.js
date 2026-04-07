import userModel from "../models/user_model.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET=process.env.JWT_SECRET || "your_jwt_secret";
const Token_Expiry="24h"; // Token expires in 24 hours

const createToken=(userId)=>{
    return jwt.sign({id:userId},JWT_SECRET,{expiresIn:Token_Expiry});
} 

// Register a new user
export const registerUser = async (req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        return res.status(400).json({success:false,message:"Please provide name, email and password"});
    }
    if  (!validator.isEmail(email)){
        return res.status(400).json({success:false,message:"Please provide a valid email"});
    }
    if(password.length<8){  
        return res.status(400).json({success:false,message:"Password must be at least 8 characters long"});
    }
    try{
        if(await userModel.findOne({email})){
            return res.status(400).json({success:false,message:"Email already exists"});
        }
        // Create new user
        const bcryptedPassword=await bcrypt.hash(password,10);
        const newUser=new userModel({name,email,password:bcryptedPassword});
        await newUser.save();
        const token=createToken(newUser._id);
        res.status(201).json({success:true,message:"User registered successfully",token});
    } catch (error) {
        res.status(500).json({success:false,message:"Server error",error:error.message});

    }
}


// To login an existing user
export const loginUser = async (req,res)=> {
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({success:false,message:"Please provide email and password"});
    }   
    try{
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:"Invalid email or password"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({success:false,message:"Invalid email or password"});
        }
        const token=createToken(user._id);
        res.status(200).json({success:true,message:"User logged in successfully",token});
    } catch (error) {
        res.status(500).json({success:false,message:"Server error",error:error.message});
    }
}


//to get logined user details
export const getUserDetails=async (req,res)=>{
    try {
        const user=await userModel.findById(req.user.id).select("name email");
        if(!user){
            return res.status(404).json({success:false,message:"User not found"});
        }
        res.status(200).json({success:true,user});
    } catch (error) {
        res.status(500).json({success:false,message:"Server error",error:error.message});
    }
}

//to update user details
export const updateUserDetails=async (req,res)=>{
    const {name,email,password}=req.body;
    try {
        const user=await userModel.findById(req.user.id);
        if(!user){
            return res.status(404).json({success:false,message:"User not found"});
        }
        if(name) user.name=name;
        if(email){
            if(!validator.isEmail(email)){
                return res.status(400).json({success:false,message:"Please provide a valid email"});
            }
            user.email=email;
        }
        if(password){
            if(password.length<8){
                return res.status(400).json({success:false,message:"Password must be at least 8 characters long"});
            }
            user.password=await bcrypt.hash(password,10);
        }
        await user.save();
        res.status(200).json({success:true,message:"User details updated successfully",user});
    } catch (error) {
        res.status(500).json({success:false,message:"Server error",error:error.message});
    }
}
