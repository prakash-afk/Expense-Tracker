import {
  AlertTriangle,
  ArrowRight,
  PiggyBank,
  Plus,
  ReceiptIndianRupee,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { AnimatePresence, motion as Motion } from "framer-motion";
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
  getAdaptiveValueTextClass,
  getMonthLabel,
  getSpendingWarning,
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
  const [isManualCriticalModalOpen, setIsManualCriticalModalOpen] = useState(false);

  const transactions = filterTransactionsByRange(financeApp.allTransactions, activeRange);
  const incomeTransactions = transactions.filter((item) => item.type === "income");
  const expenseTransactions = transactions.filter((item) => item.type === "expense");
  const totalIncome = incomeTransactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalExpense = expenseTransactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome === 0 ? 0 : Math.round((balance / totalIncome) * 100);
  const expenseDistribution = buildExpenseDistribution(expenseTransactions);
  const spendingWarning = getSpendingWarning(
    financeApp.dashboard.monthlyIncome,
    financeApp.dashboard.monthlyExpense,
  );
  const monthlyRemaining =
    Number(financeApp.dashboard.monthlyIncome || 0) -
    Number(financeApp.dashboard.monthlyExpense || 0);
  const isCriticalWarningOpen =
    financeApp.spendingAlert.open || isManualCriticalModalOpen;
  const criticalModalData = financeApp.spendingAlert.open
    ? financeApp.spendingAlert
    : {
        level: spendingWarning.level,
        percentage: spendingWarning.percentage,
        monthlyIncome: financeApp.dashboard.monthlyIncome || 0,
        monthlyExpense: financeApp.dashboard.monthlyExpense || 0,
        remaining: monthlyRemaining,
        breakdown: financeApp.dashboard.expenseDistribution || [],
      };

  const closeCriticalWarning = () => {
    setIsManualCriticalModalOpen(false);
    financeApp.hideSpendingAlert();
  };

  const topCards = [
    {
      label: "Total Balance",
      value: formatCurrency(balance),
      numericValue: balance,
      formatAnimatedValue: formatCurrency,
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

      {(spendingWarning.level === "HIGH" || spendingWarning.level === "CRITICAL") ? (
        <section
          className={`rounded-[28px] border p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] ${
            spendingWarning.level === "CRITICAL"
              ? "border-red-200 bg-red-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div
                className={`grid h-12 w-12 place-items-center rounded-2xl ${
                  spendingWarning.level === "CRITICAL"
                    ? "bg-red-100 text-red-600"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                {spendingWarning.level === "CRITICAL" ? (
                  <ShieldAlert size={24} />
                ) : (
                  <AlertTriangle size={24} />
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {spendingWarning.level === "CRITICAL"
                    ? "Critical spending alert"
                    : "High spending warning"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  You have used {Math.round(spendingWarning.percentage)}% of this month&apos;s income.
                  {spendingWarning.level === "CRITICAL"
                    ? " Review the spending breakdown now before your balance slips further."
                    : " Keep an eye on your expenses so the month stays under control."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/expense")}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:border-amber-200 hover:text-amber-700"
              >
                Review Expenses
              </button>
              {spendingWarning.level === "CRITICAL" ? (
                <button
                  type="button"
                  onClick={() => setIsManualCriticalModalOpen(true)}
                  className="rounded-2xl bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-600"
                >
                  View Breakdown
                </button>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.9fr_1fr]">
        <div className="grid gap-6">
          <article className="rounded-[30px] border border-slate-200/70 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-teal-600" size={24} />
                  <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Financial Overview</h1>
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
                  <h2 className="text-3xl font-bold tracking-tight text-teal-700 sm:text-[2.4rem]">
                    Finance Dashboard
                  </h2>
                  <p className="mt-2 max-w-xl text-base text-slate-600 sm:text-lg">
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
                numericValue={balance}
                formatAnimatedValue={formatCurrency}
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
                numericValue={balance}
                formatAnimatedValue={formatCurrency}
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

          <div className="grid items-stretch gap-6 xl:grid-cols-2">
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
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{item.category}</p>
                    <p className="text-sm text-slate-500">{item.percent}% of spending</p>
                  </div>
                  <p
                    className={`max-w-[42%] break-words text-right font-bold leading-tight text-slate-900 ${getAdaptiveValueTextClass(formatCurrency(item.amount), {
                      defaultSize: "text-base sm:text-lg",
                      longSize: "text-sm sm:text-base",
                      extraLongSize: "text-sm",
                      ultraLongSize: "text-xs sm:text-sm",
                    })}`}
                  >
                    {formatCurrency(item.amount)}
                  </p>
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
                <p
                  className={`mt-2 break-words font-bold leading-tight text-slate-900 ${getAdaptiveValueTextClass(formatCurrency(totalIncome), {
                    defaultSize: "text-2xl",
                    longSize: "text-xl",
                    extraLongSize: "text-lg",
                    ultraLongSize: "text-base",
                  })}`}
                >
                  {formatCurrency(totalIncome)}
                </p>
              </div>
              <div className="rounded-[24px] bg-orange-50 px-4 py-4">
                <p className="text-sm text-slate-500">Total Expenses</p>
                <p
                  className={`mt-2 break-words font-bold leading-tight text-slate-900 ${getAdaptiveValueTextClass(formatCurrency(totalExpense), {
                    defaultSize: "text-2xl",
                    longSize: "text-xl",
                    extraLongSize: "text-lg",
                    ultraLongSize: "text-base",
                  })}`}
                >
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

      <AnimatePresence>
        {isCriticalWarningOpen ? (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/45 px-4 py-8 backdrop-blur-sm"
          >
            <Motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 14 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl overflow-hidden rounded-[30px] bg-white shadow-[0_40px_80px_rgba(15,23,42,0.24)]"
            >
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold">Spending Critical</h2>
                    <p className="mt-2 text-sm text-white/90">
                      You have already used {Math.round(criticalModalData.percentage)}% of this month&apos;s income.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeCriticalWarning}
                    className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white"
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>

                <div className="grid gap-5 p-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-[24px] bg-slate-50 px-4 py-4">
                      <p className="text-sm text-slate-500">Monthly Income</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {formatCurrency(criticalModalData.monthlyIncome)}
                      </p>
                    </div>
                    <div className="rounded-[24px] bg-red-50 px-4 py-4">
                      <p className="text-sm text-slate-500">Monthly Expense</p>
                      <p className="mt-2 text-2xl font-bold text-red-600">
                        {formatCurrency(criticalModalData.monthlyExpense)}
                      </p>
                    </div>
                    <div className="rounded-[24px] bg-amber-50 px-4 py-4">
                      <p className="text-sm text-slate-500">Remaining Balance</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {formatCurrency(criticalModalData.remaining)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-xl font-bold text-slate-900">Spending breakdown</h3>
                    <div className="mt-4 grid gap-3">
                      {criticalModalData.breakdown.slice(0, 5).map((item) => (
                      <div
                        key={item.category}
                        className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">{item.category}</p>
                          <p className="text-sm text-slate-500">
                            {item.percent}% of monthly spending
                          </p>
                        </div>
                        <p className="font-bold text-slate-900">
                          {formatCurrency(item.amount)}
                        </p>
                      </div>
                    ))}

                      {criticalModalData.breakdown.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-5 text-center text-slate-500">
                        No category breakdown is available yet.
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeCriticalWarning}
                    className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-600"
                  >
                    Dismiss
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeCriticalWarning();
                      navigate("/expense");
                    }}
                    className="rounded-2xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
                  >
                    Review Expenses
                  </button>
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
