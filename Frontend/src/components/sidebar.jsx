import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  CircleHelp,
  House,
  LogOut,
  TrendingDown,
  TrendingUp,
  UserRound,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { getInitials } from "../utils/financeUtils";

const menuItems = [
  { label: "Dashboard", path: "/", icon: House },
  { label: "Income", path: "/income", icon: TrendingUp },
  { label: "Expenses", path: "/expense", icon: TrendingDown },
  { label: "Profile", path: "/profile", icon: UserRound },
];

const SIDEBAR_WIDTH = 232;
const SIDEBAR_COLLAPSED_WIDTH = 82;

const SidebarBody = ({
  displayName,
  displayEmail,
  collapsed,
  onToggle,
  onClose,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="sidebar-top-card">
        <div className="avatar-badge larger">{getInitials(displayName)}</div>

        {!collapsed ? (
          <div className="sidebar-user-copy">
            <strong>{displayName}</strong>
            <span>{displayEmail}</span>
          </div>
        ) : null}

        {collapsed ? null : onClose ? (
          <button type="button" className="sidebar-toggle" onClick={onClose}>
            <X size={18} />
          </button>
        ) : (
          <button type="button" className="sidebar-toggle" onClick={onToggle}>
            <ChevronRight size={18} className="rotate-180 transition-transform duration-300" />
          </button>
        )}

        {collapsed ? (
          <button type="button" className="sidebar-toggle" onClick={onToggle}>
            <ChevronRight size={18} className="transition-transform duration-300" />
          </button>
        ) : null}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : ""} ${
                collapsed ? "sidebar-link-collapsed" : ""
              }`
            }
          >
            <Icon size={20} />
            {!collapsed ? <span>{label}</span> : null}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className={`sidebar-link ${collapsed ? "sidebar-link-collapsed" : ""}`}
          onClick={() => {
            navigate("/profile");
            onClose?.();
          }}
        >
          <CircleHelp size={20} />
          {!collapsed ? <span>Support</span> : null}
        </button>

        <button
          type="button"
          className={`sidebar-link ${collapsed ? "sidebar-link-collapsed" : ""}`}
          onClick={() => {
            onLogout();
            navigate("/login");
            onClose?.();
          }}
        >
          <LogOut size={20} />
          {!collapsed ? <span>Logout</span> : null}
        </button>
      </div>
    </>
  );
};

const Sidebar = ({
  user,
  isCollapsed,
  onToggle,
  onLogout,
  isMobileMenuOpen,
  onCloseMobile,
}) => {
  const displayName = user?.name || "Demo User";
  const displayEmail = user?.email || "aryan65@example.com";

  return (
    <>
      <motion.aside
        animate={{ width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        className="sidebar-shell desktop-sidebar"
      >
        <SidebarBody
          displayName={displayName}
          displayEmail={displayEmail}
          collapsed={isCollapsed}
          onToggle={onToggle}
          onLogout={onLogout}
        />
      </motion.aside>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <>
            <motion.button
              type="button"
              className="mobile-sidebar-backdrop"
              onClick={onCloseMobile}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close navigation"
            />

            <motion.aside
              className="mobile-sidebar-shell"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <SidebarBody
                displayName={displayName}
                displayEmail={displayEmail}
                collapsed={false}
                onToggle={onToggle}
                onClose={onCloseMobile}
                onLogout={onLogout}
              />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
