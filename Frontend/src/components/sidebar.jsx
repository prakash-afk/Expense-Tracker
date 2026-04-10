import { motion } from "framer-motion";
import {
  ChevronRight,
  CircleHelp,
  House,
  LogOut,
  TrendingDown,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { getInitials } from "../utils/financeUtils";

const menuItems = [
  { label: "Dashboard", path: "/", icon: House },
  { label: "Income", path: "/income", icon: TrendingUp },
  { label: "Expenses", path: "/expense", icon: TrendingDown },
  { label: "Profile", path: "/profile", icon: UserRound },
];

const Sidebar = ({ user, isCollapsed, onToggle, onLogout }) => {
  const navigate = useNavigate();
  const displayName = user?.name || "Aarav Sharma";
  const displayEmail = user?.email || "aarav.sharma@example.in";

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 96 : 280 }}
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      className="sidebar-shell"
    >
      <div className="sidebar-top-card">
        <div className="avatar-badge larger">{getInitials(displayName)}</div>

        {!isCollapsed ? (
          <div className="sidebar-user-copy">
            <strong>{displayName}</strong>
            <span>{displayEmail}</span>
          </div>
        ) : null}

        <button type="button" className="sidebar-toggle" onClick={onToggle}>
          <ChevronRight
            size={18}
            className={`transition-transform duration-300 ${isCollapsed ? "" : "rotate-180"}`}
          />
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : ""} ${
                isCollapsed ? "sidebar-link-collapsed" : ""
              }`
            }
          >
            <Icon size={20} />
            {!isCollapsed ? <span>{label}</span> : null}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className={`sidebar-link ${isCollapsed ? "sidebar-link-collapsed" : ""}`}
          onClick={() => navigate("/profile")}
        >
          <CircleHelp size={20} />
          {!isCollapsed ? <span>Support</span> : null}
        </button>

        <button
          type="button"
          className={`sidebar-link ${isCollapsed ? "sidebar-link-collapsed" : ""}`}
          onClick={() => {
            onLogout();
            navigate("/login");
          }}
        >
          <LogOut size={20} />
          {!isCollapsed ? <span>Logout</span> : null}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
