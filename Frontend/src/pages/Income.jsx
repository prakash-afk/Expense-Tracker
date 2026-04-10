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
  formatCurrency,
  incomeCategories,
} from "../utils/financeUtils";

const Income = ({ financeApp }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const incomeList =
    categoryFilter === "All"
      ? financeApp.incomeState.list
      : financeApp.incomeState.list.filter((item) => item.category === categoryFilter);

  const transactionItems = incomeList.map((item) => ({
    ...item,
    type: "income",
    onDelete: async () => {
      await financeApp.deleteIncome(item._id);
    },
  }));

  const stats = [
    {
      label: "Total Income",
      value: formatCurrency(financeApp.incomeState.overview.total),
      helper: "This selected range",
      icon: <IndianRupee size={20} />,
      tone: "teal",
      accent: "text-teal-600 font-medium",
    },
    {
      label: "Average Income",
      value: formatCurrency(financeApp.incomeState.overview.average),
      helper: `${financeApp.incomeState.overview.transactions} transactions`,
      icon: <Sigma size={20} />,
      tone: "cyan",
    },
    {
      label: "Transactions",
      value: String(financeApp.incomeState.overview.transactions),
      helper: "All records in this view",
      icon: <BarChart3 size={20} />,
      tone: "purple",
    },
  ];

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1.9fr_1fr]">
        <div className="grid gap-6">
          <article className="rounded-[30px] border border-slate-200/70 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Income Overview</h1>
                <p className="mt-2 text-base text-slate-500 sm:text-lg">
                  Track and manage your income sources clearly.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-teal-500 px-5 py-3.5 text-base font-semibold text-white shadow-[0_16px_34px_rgba(20,184,166,0.24)] transition hover:-translate-y-0.5"
              >
                <Plus size={20} />
                Add Income
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <RangeTabs
                value={financeApp.incomeState.range}
                onChange={financeApp.setIncomeRange}
              />
            </div>
          </article>

          <section className="grid gap-4 lg:grid-cols-3">
            {stats.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </section>

          <TrendChart
            title="Daily Income Trends"
            subtitle="A day-by-day look at your current month income."
            points={buildMonthlySeries(financeApp.incomeState.list, "income")}
            accent="#14b8a6"
            emptyLabel="Add income to see your monthly trend line."
          />

          <TransactionFeed
            title="Income Transactions"
            subtitle="Manage all income entries in the selected range."
            items={transactionItems}
            type="income"
            emptyLabel="No income transactions found for this filter."
            action={
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                >
                  <option value="All">All Transactions</option>
                  {incomeCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() =>
                    downloadTransactionsCsv(
                      incomeList.map((item) => ({ ...item, type: "income" })),
                      "income-transactions.csv",
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-teal-200 hover:text-teal-700"
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
        type="income"
        isWorking={financeApp.isWorking}
        onClose={() => setIsModalOpen(false)}
        onSubmit={financeApp.addIncome}
      />
    </>
  );
};

export default Income;
