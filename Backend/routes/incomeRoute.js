import express from "express";
import { addIncome, deleteIncome, getIncomes, updateIncome, downloadIncomeExcel} from "../controllers/incomeController.js";
import {authMiddleware} from "../middleware/authMiddleware.js"; 

const incomeRouter=express.Router();

// Add new income
incomeRouter.post("/add",authMiddleware,addIncome);

// Get all incomes of logged in user
incomeRouter.get("/get",authMiddleware,getIncomes);

// Update an income
incomeRouter.put("/update/:id",authMiddleware,updateIncome);

// Delete an income
incomeRouter.delete("/delete/:id",authMiddleware,deleteIncome);

//Download the excel sheet of all incomes
incomeRouter.get("/download",authMiddleware,downloadIncomeExcel);

export default incomeRouter;

