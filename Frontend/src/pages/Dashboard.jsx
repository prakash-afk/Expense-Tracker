import React from "react";
import {
  ArrowRight,
  BadgeIndianRupee,
  PiggyBank,
  Receipt,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { dummyTransactions, financialOverviewData, statsData } from "../assets/dummy";
import { styles } from "../assets/dummyStyles";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const Dashboard = () => {
  const transactions = [...dummyTransactions].sort(
    (first, second) => new Date(second.date) - new Date(first.date),
  );
  const recentTransactions = transactions.slice(0, 6);

  const totalIncome = transactions.reduce((sum, transaction) => {
    return transaction.type === "income" ? sum + Number(transaction.amount) : sum;
  }, 0);

  const totalExpense = transactions.reduce((sum, transaction) => {
    return transaction.type === "expense" ? sum + Number(transaction.amount) : sum;
  }, 0);

  const balance = totalIncome - totalExpense;
  const statCards = [
    {
      title: "Balance",
      value: formatCurrency(balance),
      helper: "Net amount across your demo transactions",
      icon: <Wallet className="h-5 w-5 text-teal-600" />,
      iconClass: "bg-teal-100 p-2 rounded-lg",
    },
    {
      title: "Income",
      value: formatCurrency(totalIncome),
      helper: "Total credited amount",
      icon: <TrendingUp className="h-5 w-5 text-cyan-600" />,
      iconClass: "bg-cyan-100 p-2 rounded-lg",
    },
    {
      title: "Expenses",
      value: formatCurrency(totalExpense),
      helper: "Total money spent so far",
      icon: <TrendingDown className="h-5 w-5 text-orange-600" />,
      iconClass: "bg-orange-100 p-2 rounded-lg",
    },
    {
      title: "Savings Goal",
      value: formatCurrency(statsData.monthRemaining),
      helper: "Remaining budget this month",
      icon: <PiggyBank className="h-5 w-5 text-violet-600" />,
      iconClass: "bg-violet-100 p-2 rounded-lg",
    },
  ];

  return (
    <>
      <div className={styles.header.container}>
        <div>
          <h1 className={styles.header.title}>Dashboard</h1>
          <p className={styles.header.subtitle}>
            Overview of your finances, recent transactions, and category spending.
          </p>
        </div>
        <div className="rounded-xl border border-teal-100 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
          Budget: <span className="font-semibold text-gray-800">{formatCurrency(statsData.budget)}</span>
        </div>
      </div>

      <section className={styles.statCards.grid}>
        {statCards.map((card) => (
          <article key={card.title} className={styles.statCards.card}>
            <div className={styles.statCards.cardHeader}>
              <div>
                <p className={styles.statCards.cardTitle}>{card.title}</p>
                <p className={styles.statCards.cardValue}>{card.value}</p>
              </div>
              <div className={card.iconClass}>{card.icon}</div>
            </div>
            <p className={styles.statCards.cardFooter}>{card.helper}</p>
          </article>
        ))}
      </section>

      <section className={styles.grid.main}>
        <div className={styles.grid.leftColumn}>
          <article className={styles.cards.base}>
            <div className={styles.transactions.cardHeader}>
              <h2 className={styles.transactions.cardTitle}>
                <Receipt className="h-5 w-5 text-teal-600" />
                Recent Transactions
              </h2>
            </div>

            <div className={styles.transactions.listContainer}>
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className={styles.transactions.transactionItem}>
                  <div className="flex items-center gap-3">
                    <div className={styles.transactions.iconWrapper(transaction.type)}>
                      {transaction.type === "income" ? (
                        <TrendingUp className={styles.transactions.icon} />
                      ) : (
                        <TrendingDown className={styles.transactions.icon} />
                      )}
                    </div>
                    <div className={styles.transactions.details}>
                      <p className={styles.transactions.description}>{transaction.description}</p>
                      <p className={styles.transactions.meta}>
                        {transaction.category} | {transaction.date}
                      </p>
                    </div>
                  </div>
                  <p className={styles.transactions.amount(transaction.type)}>
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(Number(transaction.amount))}
                  </p>
                </div>
              ))}
            </div>

            <div className={styles.transactions.viewAllContainer}>
              <button type="button" className={styles.transactions.viewAllButton}>
                View All Transactions
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        </div>

        <aside className={styles.grid.rightColumn}>
          <article className={styles.cards.base}>
            <h2 className={styles.categories.title}>
              <BadgeIndianRupee className={styles.categories.titleIcon} />
              Spending by Category
            </h2>
            <div className={styles.categories.list}>
              {financialOverviewData.slice(0, 6).map((category) => (
                <div key={category.name} className={styles.categories.categoryItem}>
                  <div className="flex items-center gap-3">
                    <div className={styles.categories.categoryIconContainer}>
                      <Receipt className={styles.categories.categoryIcon} />
                    </div>
                    <span className={styles.categories.categoryName}>{category.name}</span>
                  </div>
                  <span className={styles.categories.categoryAmount}>
                    {formatCurrency(category.value)}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.categories.summaryContainer}>
              <div className={styles.categories.summaryGrid}>
                <div className={styles.categories.summaryIncomeCard}>
                  <p className={styles.categories.summaryTitle}>This Month Spent</p>
                  <p className={styles.categories.summaryValue}>
                    {formatCurrency(statsData.monthSpent)}
                  </p>
                </div>
                <div className={styles.categories.summaryExpenseCard}>
                  <p className={styles.categories.summaryTitle}>Top Category</p>
                  <p className={styles.categories.summaryValue}>{statsData.topCategory}</p>
                </div>
              </div>
            </div>
          </article>
        </aside>
      </section>
    </>
  );
};

export default Dashboard
