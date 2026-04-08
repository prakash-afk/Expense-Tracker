import express from 'express'
import { authMiddleware } from '../middleware/auth.js';
import { addExpense, deleteExpense, getExpense, updateExpense ,downloadExpenseExcel,getExpenseOverview} from '../controller/expenseController.js';

const expenseRouter = express.Router();

// Add new expense
expenseRouter.post("/add", authMiddleware, addExpense);

// Get all expenses of logged in user
expenseRouter.get("/get", authMiddleware, getExpense);

// Update an expense
expenseRouter.put("/update/:id", authMiddleware, updateExpense);

// Delete an expense
expenseRouter.delete("/delete/:id", authMiddleware, deleteExpense);

// Download the excel sheet of all expenses
expenseRouter.get("/download", authMiddleware, downloadExpenseExcel);

// Get expense overview
expenseRouter.get("/overview", authMiddleware, getExpenseOverview);

export default expenseRouter;
