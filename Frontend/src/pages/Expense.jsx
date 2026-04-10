import { BarChart3, Download, IndianRupee, Plus, Sigma } from "lucide-react";
import { useState } from "react";
import InsightRail from "../components/finance/InsightRail";
import RangeTabs from "../components/finance/RangeTabs";
import StatCard from "../components/finance/StatCard";
import TransactionFeed from "../components/finance/TransactionFeed";
import TransactionModal from "../components/finance/TransactionModal";
import TrendChart from "../components/finance/TrendChart";
import {
  buildMonthlySeries,
  downloadTransactionsCsv,
  expenseCategories,
  formatCurrency,
} from "../utils/financeUtils";

const Expense = ({ financeApp }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const expenseList =
    categoryFilter === "All"
      ? financeApp.expenseState.list
      : financeApp.expenseState.list.filter((item) => item.category === categoryFilter);

  const transactionItems = expenseList.map((item) => ({
    ...item,
    type: "expense",
    onDelete: async () => {
      await financeApp.deleteExpense(item._id);
    },
  }));

  const stats = [
    {
      label: "Total Expenses",
      value: formatCurrency(financeApp.expenseState.overview.total),
      helper: "This selected range",
      icon: <IndianRupee size={20} />,
      tone: "orange",
      accent: "text-orange-600 font-medium",
    },
    {
      label: "Average Expense",
      value: formatCurrency(financeApp.expenseState.overview.average),
      helper: `${financeApp.expenseState.overview.transactions} transactions`,
      icon: <Sigma size={20} />,
      tone: "orange",
    },
    {
      label: "Transactions",
      value: String(financeApp.expenseState.overview.transactions),
      helper: "All records in this view",
      icon: <BarChart3 size={20} />,
      tone: "rose",
    },
  ];

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1.9fr_1fr]">
        <div className="grid gap-6">
          <article className="rounded-[30px] border border-slate-200/70 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Expense Overview</h1>
                <p className="mt-2 text-base text-slate-500 sm:text-lg">
                  Track and manage your spending without losing detail.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3.5 text-base font-semibold text-white shadow-[0_16px_34px_rgba(249,115,22,0.24)] transition hover:-translate-y-0.5"
              >
                <Plus size={20} />
                Add Expense
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <RangeTabs
                value={financeApp.expenseState.range}
                onChange={financeApp.setExpenseRange}
                accent="orange"
              />
            </div>
          </article>

          <section className="grid gap-4 lg:grid-cols-3">
            {stats.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </section>

          <TrendChart
            title="Daily Expense Trends"
            subtitle="A day-by-day look at your current month expenses."
            points={buildMonthlySeries(financeApp.expenseState.list, "expense")}
            accent="#f97316"
            emptyLabel="Add expenses to see your monthly trend line."
          />

          <TransactionFeed
            title="Expense Transactions"
            subtitle="Manage all expense entries in the selected range."
            items={transactionItems}
            type="expense"
            emptyLabel="No expenses found for this filter."
            action={
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                >
                  <option value="All">All Transactions</option>
                  {expenseCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() =>
                    downloadTransactionsCsv(
                      expenseList.map((item) => ({ ...item, type: "expense" })),
                      "expense-transactions.csv",
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-orange-200 hover:text-orange-700"
                >
                  <Download size={16} />
                  Export
                </button>
              </div>
            }
          />
        </div>

        <InsightRail
          recentTransactions={financeApp.dashboard.recentTransactions}
          expenseDistribution={financeApp.dashboard.expenseDistribution}
        />
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        type="expense"
        isWorking={financeApp.isWorking}
        onClose={() => setIsModalOpen(false)}
        onSubmit={financeApp.addExpense}
      />
    </>
  );
};

export default Expense;
