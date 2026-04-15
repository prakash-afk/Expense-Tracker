import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout";
import { useFinanceApp } from "./hooks/useFinanceApp";
import Dashboard from "./pages/Dashboard";
import Expense from "./pages/Expense";
import Income from "./pages/Income";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

const ProtectedRoute = ({ isAllowed, children }) => {
  if (!isAllowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const financeApp = useFinanceApp();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login
            onLogin={financeApp.login}
            isWorking={financeApp.isWorking}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <Signup
            onSignup={financeApp.signup}
            isWorking={financeApp.isWorking}
          />
        }
      />

      <Route
        element={
          <ProtectedRoute isAllowed={financeApp.isAuthenticated}>
            <Layout financeApp={financeApp} />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard financeApp={financeApp} />} />
        <Route path="/income" element={<Income financeApp={financeApp} />} />
        <Route path="/expense" element={<Expense financeApp={financeApp} />} />
        <Route path="/profile" element={<Profile financeApp={financeApp} />} />
      </Route>

      <Route path="*" element={<Navigate to={financeApp.isAuthenticated ? "/" : "/login"} replace />} />
    </Routes>
  );
};

export default App;
