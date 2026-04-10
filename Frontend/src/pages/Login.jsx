import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

const cardMotion = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const Login = ({ onLogin, isWorking, isAuthenticated }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [formValues, setFormValues] = useState({
    email: "aarav.sharma@example.in",
    password: "nariyal12",
    remember: true,
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const updateField = (field, value) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const response = await onLogin(formValues);

    if (!response.success) {
      setMessage(response.message);
      return;
    }

    navigate("/");
  };

  return (
    <div className="auth-shell">
      <motion.div
        variants={cardMotion}
        initial="hidden"
        animate="visible"
        className="auth-card"
      >
        <div className="auth-hero">
          <div className="auth-icon-circle">
            <UserRound size={42} />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your Expense Tracker account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span>Email Address</span>
            <div className="auth-input-wrap">
              <Mail size={20} />
              <input
                type="email"
                value={formValues.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="aarav.sharma@example.in"
                required
              />
            </div>
          </label>

          <label className="auth-field">
            <span>Password</span>
            <div className="auth-input-wrap">
              <Lock size={20} />
              <input
                type={showPassword ? "text" : "password"}
                value={formValues.password}
                onChange={(event) => updateField("password", event.target.value)}
                placeholder="Enter your password"
                minLength={8}
                required
              />
              <button
                type="button"
                className="icon-button"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </label>

          <label className="auth-check">
            <input
              type="checkbox"
              checked={formValues.remember}
              onChange={(event) => updateField("remember", event.target.checked)}
            />
            <span>Remember me</span>
          </label>

          <AnimatePresence mode="wait">
            {message ? (
              <motion.p
                key={message}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="auth-message auth-message-error"
              >
                {message}
              </motion.p>
            ) : null}
          </AnimatePresence>

          <button type="submit" className="primary-button" disabled={isWorking}>
            {isWorking ? "Signing in..." : "Sign in"}
          </button>

          <p className="auth-switch">
            Don&apos;t have an account? <Link to="/signup">Create One</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
