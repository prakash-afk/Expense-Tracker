import {
  ArrowRight,
  PiggyBank,
  Plus,
  ReceiptIndianRupee,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DonutChart from "../components/finance/DonutChart";
import GaugeCard from "../components/finance/GaugeCard";
import RangeTabs from "../components/finance/RangeTabs";
import StatCard from "../components/finance/StatCard";
import TransactionFeed from "../components/finance/TransactionFeed";
import TransactionModal from "../components/finance/TransactionModal";
import {
  clampPercent,
  filterTransactionsByRange,
  formatCompactCurrency,
  formatCurrency,
  getMonthLabel,
} from "../utils/financeUtils";

const rangeLabels = {
  daily: "today",
  weekly: "this week",
  monthly: "this month",
  yearly: "this year",
};

const buildExpenseDistribution = (items) => {
  const totalExpense = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const grouped = {};

  items.forEach((item) => {
    grouped[item.category] = (grouped[item.category] || 0) + Number(item.amount || 0);
  });

  return Object.entries(grouped)
    .map(([category, amount]) => ({
      category,
      amount,
      percent: totalExpense === 0 ? 0 : Math.round((amount / totalExpense) * 100),
    }))
    .sort((first, second) => second.amount - first.amount);
};

const Dashboard = ({ financeApp }) => {
  const navigate = useNavigate();
  const [activeRange, setActiveRange] = useState("monthly");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("income");

  const transactions = filterTransactionsByRange(financeApp.allTransactions, activeRange);
  const incomeTransactions = transactions.filter((item) => item.type === "income");
  const expenseTransactions = transactions.filter((item) => item.type === "expense");
  const totalIncome = incomeTransactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalExpense = expenseTransactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome === 0 ? 0 : Math.round((balance / totalIncome) * 100);
  const expenseDistribution = buildExpenseDistribution(expenseTransactions);

  const topCards = [
    {
      label: "Total Balance",
      value: formatCurrency(balance),
      helper: `${formatCompactCurrency(balance)} for ${rangeLabels[activeRange]}`,
      icon: <Wallet size={22} />,
      tone: "teal",
      accent: balance >= 0 ? "text-teal-600 font-medium" : "text-orange-600 font-medium",
    },
    {
      label: "Monthly Income",
      value: formatCurrency(financeApp.dashboard.monthlyIncome),
      helper: `${incomeTransactions.length} tracked income record${incomeTransactions.length === 1 ? "" : "s"}`,
      icon: <TrendingUp size={22} />,
      tone: "cyan",
      accent: "text-teal-600 font-medium",
    },
    {
      label: "Monthly Expense",
      value: formatCurrency(financeApp.dashboard.monthlyExpense),
      helper: `${expenseTransactions.length} tracked expense record${expenseTransactions.length === 1 ? "" : "s"}`,
      icon: <TrendingDown size={22} />,
      tone: "orange",
      accent: "text-orange-600 font-medium",
    },
    {
      label: "Saving Rate",
      value: `${financeApp.dashboard.savingsRate || 0}%`,
      helper:
        financeApp.dashboard.savingsRate >= 50
          ? "Excellent"
          : financeApp.dashboard.savingsRate >= 20
            ? "Healthy progress"
            : "Needs improvement",
      icon: <PiggyBank size={22} />,
      tone: "purple",
    },
  ];

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 lg:grid-cols-4">
        {topCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.9fr_1fr]">
        <div className="grid gap-6">
          <article className="rounded-[30px] border border-slate-200/70 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-teal-600" size={24} />
                  <h1 className="text-3xl font-bold text-slate-900">Financial Overview</h1>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500">
                    This {getMonthLabel()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-teal-500 px-5 py-3.5 text-base font-semibold text-white shadow-[0_16px_34px_rgba(20,184,166,0.24)] transition hover:-translate-y-0.5"
              >
                <Plus size={20} />
                Add Transaction
              </button>
            </div>

            <div className="rounded-[28px] border border-teal-100 bg-gradient-to-br from-cyan-50 to-emerald-50 p-6 shadow-[0_24px_40px_rgba(20,184,166,0.12)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-[2.4rem] font-bold tracking-tight text-teal-700">
                    Finance Dashboard
                  </h2>
                  <p className="mt-2 max-w-xl text-lg text-slate-600">
                    Track your income and expenses with smooth, readable summaries.
                  </p>
                </div>

                <RangeTabs value={activeRange} onChange={setActiveRange} />
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <StatCard
                label="Total Balance"
                value={formatCurrency(balance)}
                helper="Net amount after income and expense"
                icon={<Wallet size={20} />}
                tone="teal"
                accent={balance >= 0 ? "text-teal-600 font-medium" : "text-orange-600 font-medium"}
              />
              <StatCard
                label="This Month Expenses"
                value={formatCurrency(totalExpense)}
                helper="Current filtered expense total"
                icon={<TrendingDown size={20} />}
                tone="orange"
                accent="text-orange-600 font-medium"
              />
              <StatCard
                label="This Month Savings"
                value={formatCurrency(balance)}
                helper={`${clampPercent(savingsRate)}% of income`}
                icon={<PiggyBank size={20} />}
                tone="sky"
                accent="text-sky-600 font-medium"
              />
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <GaugeCard
                title="Income"
                amount={formatCurrency(totalIncome)}
                percent={totalIncome > 0 ? 100 : 0}
                color="#0f9f76"
                footer="Current filtered total"
              />
              <GaugeCard
                title="Spent"
                amount={formatCurrency(totalExpense)}
                percent={totalIncome === 0 ? 0 : clampPercent((totalExpense / totalIncome) * 100)}
                color="#f97316"
                footer="Share of income used"
              />
              <GaugeCard
                title="Savings"
                amount={formatCurrency(balance)}
                percent={totalIncome === 0 ? 0 : clampPercent((balance / totalIncome) * 100)}
                color="#ef4444"
                footer="Money still available"
              />
            </div>
          </article>

          <DonutChart
            title="Expense Distribution"
            subtitle="A quick look at where your money is going right now."
            items={expenseDistribution}
          />

          <div className="grid gap-6 xl:grid-cols-2">
            <TransactionFeed
              title="Recent Income"
              subtitle={`This ${getMonthLabel()}`}
              type="income"
              items={incomeTransactions.slice(0, 4)}
              emptyLabel="No income records found for this view."
            />
            <TransactionFeed
              title="Recent Expenses"
              subtitle={`This ${getMonthLabel()}`}
              type="expense"
              items={expenseTransactions.slice(0, 4)}
              emptyLabel="No expenses recorded for this view."
            />
          </div>
        </div>

        <div className="grid content-start gap-6">
          <TransactionFeed
            title="Recent Transactions"
            subtitle="Transactions are stacked by date, newest first."
            items={transactions.slice(0, 6)}
            emptyLabel="Your recent transactions will appear here."
            action={
              <button
                type="button"
                onClick={() => navigate("/income")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-teal-200 hover:text-teal-700"
              >
                View More
                <ArrowRight size={16} />
              </button>
            }
          />

          <article className="rounded-[30px] border border-slate-200/70 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
              <ReceiptIndianRupee className="text-sky-500" size={24} />
              Spending by Category
            </h2>

            <div className="mt-6 grid gap-4">
              {expenseDistribution.slice(0, 5).map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{item.category}</p>
                    <p className="text-sm text-slate-500">{item.percent}% of spending</p>
                  </div>
                  <p className="font-bold text-slate-900">{formatCurrency(item.amount)}</p>
                </div>
              ))}

              {expenseDistribution.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                  Category totals will show up once you add some expenses.
                </div>
              ) : null}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] bg-cyan-50 px-4 py-4">
                <p className="text-sm text-slate-500">Total Income</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
              <div className="rounded-[24px] bg-orange-50 px-4 py-4">
                <p className="text-sm text-slate-500">Total Expenses</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(totalExpense)}
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <TransactionModal
        isOpen={isModalOpen}
        type={transactionType}
        allowTypeSwitch
        onTypeChange={setTransactionType}
        isWorking={financeApp.isWorking}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(values) =>
          transactionType === "income"
            ? financeApp.addIncome(values)
            : financeApp.addExpense(values)
        }
      />
    </div>
  );
};

export default Dashboard;
