import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { getInitials } from "../utils/financeUtils";

const dropdownMotion = {
  hidden: { opacity: 0, y: -10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: { duration: 0.16, ease: "easeOut" },
  },
};

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName = user?.name || "Aarav Sharma";
  const displayEmail = user?.email || "aarav.sharma@example.in";

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header className="topbar">
      <button type="button" className="brand" onClick={() => navigate("/")}>
        <img src={logo} alt="Expense Tracker" className="brand-logo" />
        <div className="brand-text">
          <span className="brand-title">Expense Tracker</span>
        </div>
      </button>

      <div ref={menuRef} className="user-menu">
        <button
          type="button"
          className="user-menu-trigger"
          onClick={() => setIsOpen((current) => !current)}
        >
          <div className="avatar-badge">
            {getInitials(displayName)}
            <span className="status-dot" />
          </div>

          <div className="user-copy">
            <strong>{displayName}</strong>
            <span>{displayEmail}</span>
          </div>

          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {isOpen ? (
            <motion.div
              variants={dropdownMotion}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="user-dropdown"
            >
              <div className="user-dropdown-header">
                <div className="avatar-badge large">{getInitials(displayName)}</div>
                <div className="user-copy">
                  <strong>{displayName}</strong>
                  <span>{displayEmail}</span>
                </div>
              </div>

              <button
                type="button"
                className="dropdown-link"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/profile");
                }}
              >
                <UserRound size={18} />
                <span>My Profile</span>
              </button>

              <button
                type="button"
                className="dropdown-link danger"
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                  navigate("/login");
                }}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
