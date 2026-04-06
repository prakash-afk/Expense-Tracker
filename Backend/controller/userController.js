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