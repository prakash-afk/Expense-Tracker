import expenseModel from "../models/expense_model.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dataFilter.js";

// add new expense
export async function addExpense(req, res) {
    const userId = req.user.id;
    const { description, amount, category, date } = req.body;

    if (!description || !amount || !category || !date) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields"
        });
    }

    try {
        const newExpense = new expenseModel({
            description,
            amount,
            category,
            date: new Date(date),
            userId
        });

        await newExpense.save();

        return res.status(201).json({
            success: true,
            message: "Expense added successfully",
            expense: newExpense
        });
    } catch (error) {
        console.error("Error adding expense:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// get all expenses of logged-in user
export async function getExpense(req, res) {
    const userId = req.user.id;

    try {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 });

        return res.status(200).json({
            success: true,
            message: "Expenses fetched successfully",
            expenses
        });
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// update expense
export async function updateExpense(req, res) {
    const userId = req.user.id;
    const { id } = req.params;
    const { description, amount, category, date } = req.body;

    try {
        const expense = await expenseModel.findOne({ _id: id, userId });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        if (description) expense.description = description;
        if (amount) expense.amount = amount;
        if (category) expense.category = category;
        if (date) expense.date = new Date(date);

        await expense.save();

        return res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            expense
        });
    } catch (error) {
        console.error("Error updating expense:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// delete an expense
export async function deleteExpense(req, res) {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        const expense = await expenseModel.findOne({ _id: id, userId });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        await expense.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Expense deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting expense:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// download expenses in Excel sheet format
export async function downloadExpenseExcel(req, res) {
    const userId = req.user.id;

    try {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 });

        const data = expenses.map((expense) => ({
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
            date: expense.date.toISOString().split("T")[0]
        }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

        const buffer = XLSX.write(workbook, {
            type: "buffer",
            bookType: "xlsx"
        });

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=expense_details.xlsx"
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return res.send(buffer);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error downloading expenses",
            error: error.message
        });
    }
}

// get overview of expenses
export async function getExpenseOverview(req, res) {
    const userId = req.user.id;
    const { range } = req.query;

    try {
        const { start, end } = getDateRange(range);

        const expenses = await expenseModel
            .find({
                userId,
                date: { $gte: start, $lte: end }
            })
            .sort({ date: -1 });

        const totalExpense = expenses.reduce((acc, cur) => acc + cur.amount, 0);
        const averageExpense =
            expenses.length > 0 ? totalExpense / expenses.length : 0;
        const numberOfTransactions = expenses.length;
        const recentTransactions = expenses.slice(0, 9);

        return res.status(200).json({
            success: true,
            message: "Expense overview fetched successfully",
            overview: {
                totalExpense,
                averageExpense,
                numberOfTransactions,
                recentTransactions
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching expense overview",
            error: error.message
        });
    }
}
