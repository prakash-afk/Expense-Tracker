import { useEffect, useState } from "react";
import {
  api,
  clearStoredSession,
  readStoredSession,
  saveStoredSession,
  withToken,
} from "../utils/api";
import { createEmptyOverview, sortByNewest } from "../utils/financeUtils";

const defaultDashboard = {
  monthlyIncome: 0,
  monthlyExpense: 0,
  savings: 0,
  savingsRate: 0,
  recentTransactions: [],
  expenseDistribution: [],
};

const defaultFeedback = {
  open: false,
  type: "income",
  title: "",
  message: "",
};

const getSpendingRatio = (dashboardData) => {
  const income = Number(dashboardData?.monthlyIncome || 0);
  const expense = Number(dashboardData?.monthlyExpense || 0);

  if (income <= 0) {
    return 0;
  }

  return expense / income;
};

export const useFinanceApp = () => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [isBooting, setIsBooting] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [dashboard, setDashboard] = useState(defaultDashboard);
  const [incomeState, setIncomeState] = useState({
    range: "monthly",
    list: [],
    overview: createEmptyOverview("income"),
  });
  const [expenseState, setExpenseState] = useState({
    range: "monthly",
    list: [],
    overview: createEmptyOverview("expense"),
  });
  const [feedback, setFeedback] = useState(defaultFeedback);

  const clearSession = () => {
    clearStoredSession();
    setToken("");
    setUser(null);
    setDashboard(defaultDashboard);
    setIncomeState({
      range: "monthly",
      list: [],
      overview: createEmptyOverview("income"),
    });
    setExpenseState({
      range: "monthly",
      list: [],
      overview: createEmptyOverview("expense"),
    });
  };

  const fetchCurrentUser = async (activeToken) => {
    const response = await api.get("/user/me", withToken(activeToken));
    return response.data.user;
  };

  const loadDashboard = async (activeToken = token) => {
    if (!activeToken) {
      return defaultDashboard;
    }

    const response = await api.get("/dashboard/overview", withToken(activeToken));
    const nextDashboard = response.data.data || defaultDashboard;
    setDashboard(nextDashboard);
    return nextDashboard;
  };

  const loadIncomes = async (range = incomeState.range, activeToken = token) => {
    if (!activeToken) {
      return {
        range,
        list: [],
        overview: createEmptyOverview("income"),
      };
    }

    const [listResponse, overviewResponse] = await Promise.all([
      api.get("/income/get", withToken(activeToken)),
      api.get(`/income/overview?range=${range}`, withToken(activeToken)),
    ]);

    const list = listResponse.data.incomes || [];
    const overview = overviewResponse.data.overview || {};

    const nextIncomeState = {
      range,
      list,
      overview: {
        total: overview.totalIncome || 0,
        average: overview.averageIncome || 0,
        transactions: overview.numberOfTransactions || 0,
        recentTransactions: overview.recentTransactions || [],
        kind: "income",
      },
    };

    setIncomeState(nextIncomeState);
    return nextIncomeState;
  };

  const loadExpenses = async (range = expenseState.range, activeToken = token) => {
    if (!activeToken) {
      return {
        range,
        list: [],
        overview: createEmptyOverview("expense"),
      };
    }

    const [listResponse, overviewResponse] = await Promise.all([
      api.get("/expense/get", withToken(activeToken)),
      api.get(`/expense/overview?range=${range}`, withToken(activeToken)),
    ]);

    const list = listResponse.data.expenses || [];
    const overview = overviewResponse.data.overview || {};

    const nextExpenseState = {
      range,
      list,
      overview: {
        total: overview.totalExpense || 0,
        average: overview.averageExpense || 0,
        transactions: overview.numberOfTransactions || 0,
        recentTransactions: overview.recentTransactions || [],
        kind: "expense",
      },
    };

    setExpenseState(nextExpenseState);
    return nextExpenseState;
  };

  const refreshAllData = async (activeToken = token) => {
    const [nextDashboard, nextIncomeState, nextExpenseState] = await Promise.all([
      loadDashboard(activeToken),
      loadIncomes(incomeState.range, activeToken),
      loadExpenses(expenseState.range, activeToken),
    ]);

    return {
      dashboard: nextDashboard,
      incomeState: nextIncomeState,
      expenseState: nextExpenseState,
    };
  };

  const showFeedback = (type, title, message) => {
    setFeedback({
      open: true,
      type,
      title,
      message,
    });
  };

  const hideFeedback = () => {
    setFeedback(defaultFeedback);
  };

  const completeAuth = async (nextToken, remember = true) => {
    const nextUser = await fetchCurrentUser(nextToken);

    setToken(nextToken);
    setUser(nextUser);
    saveStoredSession({
      token: nextToken,
      user: nextUser,
      remember,
    });

    await refreshAllData(nextToken);
  };

  const login = async (values) => {
    setIsWorking(true);

    try {
      const response = await api.post("/user/login", {
        email: values.email,
        password: values.password,
      });

      await completeAuth(response.data.token, values.remember);

      return {
        success: true,
        message: "Welcome back to your expense tracker.",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "We could not sign you in right now. Please try again.",
      };
    } finally {
      setIsWorking(false);
    }
  };

  const signup = async (values) => {
    setIsWorking(true);

    try {
      const response = await api.post("/user/register", {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      await completeAuth(response.data.token, values.remember);

      return {
        success: true,
        message: "Your account is ready.",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "We could not create your account right now. Please try again.",
      };
    } finally {
      setIsWorking(false);
    }
  };

  const logout = () => {
    clearSession();
  };

  const updateProfile = async (values) => {
    setIsWorking(true);

    try {
      const response = await api.put(
        "/user/profileUpdate",
        values,
        withToken(token),
      );

      const updatedUser = response.data.user;
      setUser(updatedUser);
      saveStoredSession({
        token,
        user: updatedUser,
        remember: true,
      });

      return {
        success: true,
        message: response.data.message || "Profile updated successfully.",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Profile update failed. Please try again.",
      };
    } finally {
      setIsWorking(false);
    }
  };

  const addIncome = async (values) => {
    setIsWorking(true);

    try {
      const response = await api.post(
        "/income/add",
        values,
        withToken(token),
      );

      await refreshAllData();
      showFeedback(
        "income",
        "Income added",
        "Nice work. Your balance just moved in the right direction.",
      );

      return {
        success: true,
        item: response.data.income,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Income could not be added.",
      };
    } finally {
      setIsWorking(false);
    }
  };

  const addExpense = async (values) => {
    setIsWorking(true);

    try {
      const response = await api.post(
        "/expense/add",
        values,
        withToken(token),
      );

      const refreshedData = await refreshAllData();
      const nextSpendingRatio = getSpendingRatio(refreshedData.dashboard);

      if (nextSpendingRatio >= 0.7) {
        showFeedback(
          "warning",
          "Spend carefully",
          `You have already used ${Math.round(nextSpendingRatio * 100)}% of this month's income. Slow down a little and protect your savings.`,
        );
      } else {
        showFeedback(
          "expense",
          "Expense added",
          "Not the happiest update, but your tracker is staying honest.",
        );
      }

      return {
        success: true,
        item: response.data.expense,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Expense could not be added.",
      };
    } finally {
      setIsWorking(false);
    }
  };

  const deleteIncome = async (id) => {
    await api.delete(`/income/delete/${id}`, withToken(token));
    await refreshAllData();
  };

  const deleteExpense = async (id) => {
    await api.delete(`/expense/delete/${id}`, withToken(token));
    await refreshAllData();
  };

  useEffect(() => {
    const restoreSession = async () => {
      const savedSession = readStoredSession();

      if (!savedSession?.token) {
        setIsBooting(false);
        return;
      }

      try {
        await completeAuth(savedSession.token, savedSession.remember);
      } catch (error) {
        console.error("Session restore failed:", error);
        clearSession();
      } finally {
        setIsBooting(false);
      }
    };

    restoreSession();
  }, []);

  return {
    token,
    user,
    isAuthenticated: Boolean(token && user),
    isBooting,
    isWorking,
    dashboard,
    incomeState,
    expenseState,
    feedback,
    setIncomeRange: loadIncomes,
    setExpenseRange: loadExpenses,
    refreshAllData,
    login,
    signup,
    logout,
    updateProfile,
    addIncome,
    addExpense,
    deleteIncome,
    deleteExpense,
    hideFeedback,
    allTransactions: sortByNewest([
      ...incomeState.list.map((item) => ({ ...item, type: "income" })),
      ...expenseState.list.map((item) => ({ ...item, type: "expense" })),
    ]),
  };
};
