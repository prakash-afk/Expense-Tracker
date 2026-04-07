import incomeModel from "../models/income_model.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dataFilter.js";

//add new income
export async function addIncome(req,res){
    const userId=req.user._id;
    const {description,amount,category,date}=req.body;
    if(!description || !amount || !category || !date){
        return res.status(400).json({success:false,message:"Please provide all required fields"});
    }
    try{
        const newIncome=new incomeModel({
            description,
            amount,
            category,
            date:new Date(date),
            userId
        });
        await newIncome.save();
        return res.status(201).json({success:true,message:"Income added successfully",income:newIncome});
    }catch(error){
        return res.status(500).json({success:false,message:"Error adding income",error:error.message});
    }
}

//to get all income of logined user
export async function getIncomes(req,res){
    const userId=req.user._id;
    try{
        const incomes=await incomeModel.find({userId}).sort({date:-1});
        return res.status(200).json({success:true,message: "Incomes fetched successfully",incomes});
    }catch(error){
        return res.status(500).json({success:false,message:"Error fetching incomes",error:error.message});
    }
}


//update income
export async function updateIncome(req,res){
    const userID=req.user._id;
    const {id}=req.params;
    const {description,amount,category,date}=req.body;
    try{
        const income=await incomeModel.findOne({_id:id,userId:userID});
        if(!income){
            return res.status(404).json({success:false,message:"Income not found"});
        }
        income.description=description;
        income.amount=amount;
        income.category=category;
        income.date=new Date(date);
        await income.save();
        return res.status(200).json({success:true,message:"Income updated successfully",income});
    }catch(error){
        return res.status(500).json({success:false,message:"Error updating income",error:error.message});
    }

}

// to delete an income
export async function deleteIncome(req,res){
    const userID=req.user._id;
    const {id}=req.params;
    try{
        const income=await incomeModel.findOne({_id:id,userId:userID});
        if(!income){
            return res.status(404).json({success:false,message:"Income not found"});
        }
        await income.deleteOne();
        return res.status(200).json({success:true,message:"Income deleted successfully"});
    }
    catch(error){   
        return res.status(500).json({success:false,message:"Error deleting income",error:error.message});
    }
}

// to download data in an excel sheet
export async function downloadIncomeExcel(req,res){
    const userID=req.user._id;
    try{
        const incomes=await incomeModel.find({userId:userID}).sort({date:-1});
        const data=incomes.map(income=>({
            description:income.description,
            amount:income.amount,
            category:income.category,
            date:income.date.toISOString().split("T")[0]
        }));
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        res.setHeader("Content-Disposition", "attachment; filename=income_details.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-                      officedocument.spreadsheetml.sheet");

        res.send(buffer);
    }catch(error){
        return res.status(500).json({success:false,message:"Error downloading incomes",error:error.message});
    }   
}

//to get income overview 
export async function getIncomeOverview(req,res){
    const userID=req.user._id;
    const {range}=req.query;    
    try{
        const {start,end}=getDateRange(range);
        const incomes=(await incomeModel.find({userId:userID,date:{$gte:start,$lte:end}})).sort({date:-1});
        
        

        const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
        const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
        const numberOfTransactions = incomes.length;
        const recentTransactions = incomes.slice(0, 9);
        res.status(200).json({
            success:true,
            message:"Income overview fetched successfully", 
            overview: {
                totalIncome,
                averageIncome,  
                numberOfTransactions,
                recentTransactions
            }
        });
    }catch(error){
        return res.status(500).json({success:false,message:"Error fetching income overview",error:error.message});
    }   
}
    
