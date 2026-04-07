import userModel from "../models/user_model.js";
import jwt from "jsonwebtoken";

const JWT_SECRET=process.env.JWT_SECRET || "your_jwt_secret";
export const authMiddleware=async (req,res,next)=>{
    const authHeader=req.headers.authorization; 
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({success:false,message:"Unauthorized: No token provided"});
    }
    const token=authHeader.split(" ")[1];
    try{
        const decoded=jwt.verify(token,JWT_SECRET);
        const user=await userModel.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({success:false,message:"Unauthorized: User not found"});
        }   
        req.user=decoded;
        next();
    }catch(error){
        return res.status(401).json({success:false,message:"Unauthorized: Invalid token"});
    }
}