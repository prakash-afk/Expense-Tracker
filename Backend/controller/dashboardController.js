import incomeModel from "../models/income_model.js";
import expenseModel from "../models/expense_model.js";

export async function getDashboardOverview(req,res){
    const userId=req.user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);
    try{
        const [monthlyIncomes, monthlyExpenses, recentIncomes, recentExpenses] = await Promise.all([
          incomeModel
            .find({ userId, date: { $gte: startOfMonth, $lte: endOfToday } })
            .lean(),
          expenseModel
            .find({ userId, date: { $gte: startOfMonth, $lte: endOfToday } })
            .lean(),
          incomeModel.find({
            userId,
            date: { $lte: endOfToday }
          }).sort({ date: -1, createdAt: -1 }).limit(10).lean(),
          expenseModel.find({
            userId,
            date: { $lte: endOfToday }
          }).sort({ date: -1, createdAt: -1 }).limit(10).lean(),
        ]);

        const monthlyIncome = monthlyIncomes.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
        const monthlyExpense = monthlyExpenses.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
        const savings = monthlyIncome - monthlyExpense;
        const savingsRate = monthlyIncome === 0 ? 0 : Math.round((savings / monthlyIncome) * 100);

        const recentTransactions = [
          ...recentIncomes.map((item) => ({ ...item, type: "income" })),
          ...recentExpenses.map((item) => ({ ...item, type: "expense" })),
        ]
          .sort(
            (a, b) =>
              new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt),
          )
          .slice(0, 10);

        const spendByCategory = {};
        for (const exp of monthlyExpenses) {
          const cat = exp.category || "Other";
          spendByCategory[cat] = (spendByCategory[cat] || 0) + Number(exp.amount || 0);
        }

        const expenseDistribution = Object.entries(spendByCategory).map(([category, amount]) => ({
          category,
          amount,
          percent: monthlyExpense === 0 ? 0 : Math.round((amount / monthlyExpense) * 100),
        }));

        return res.json({
          success: true,
          data: {
            monthlyIncome,
            monthlyExpense,
            savings,
            savingsRate,
            recentTransactions,
            expenseDistribution,
          },
        });
    } catch(error){
        return res.status(500).json({success:false,message:"Error fetching dashboard overview",error:error.message});
    }
}
