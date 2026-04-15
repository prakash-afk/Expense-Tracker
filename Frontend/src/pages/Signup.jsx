import { AnimatePresence, motion as Motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const cardMotion = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const Signup = ({ onSignup, isWorking }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    remember: true,
  });

  const updateField = (field, value) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const response = await onSignup(formValues);

    if (!response.success) {
      setMessage(response.message);
      return;
    }

    navigate("/");
  };

  return (
    <div className="auth-shell">
      <Motion.div
        variants={cardMotion}
        initial="hidden"
        animate="visible"
        className="auth-card"
      >
        <div className="auth-hero">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/login")}
          >
            <ArrowLeft size={24} />
          </button>
          <div className="auth-icon-circle">
            <UserRound size={42} />
          </div>
          <h1>Create Account</h1>
          <p>Join Expense Tracker to manage your money clearly</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span>Full Name</span>
            <div className="auth-input-wrap">
              <User size={20} />
              <input
                type="text"
                value={formValues.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Demo User"
                required
              />
            </div>
          </label>

          <label className="auth-field">
            <span>Email Address</span>
            <div className="auth-input-wrap">
              <Mail size={20} />
              <input
                type="email"
                value={formValues.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="aryan65@example.com"
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
                placeholder="demo12345"
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
              <Motion.p
                key={message}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="auth-message auth-message-error"
              >
                {message}
              </Motion.p>
            ) : null}
          </AnimatePresence>

          <button type="submit" className="primary-button" disabled={isWorking}>
            {isWorking ? "Creating account..." : "Create Account"}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </Motion.div>
    </div>
  );
};

export default Signup;
