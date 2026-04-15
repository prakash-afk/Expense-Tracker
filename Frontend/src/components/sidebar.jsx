import { AnimatePresence, motion as Motion } from "framer-motion";
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
const sidebarTransition = {
  duration: 0.48,
  ease: [0.16, 1, 0.3, 1],
};
const labelMotion = {
  hidden: {
    opacity: 0,
    x: -8,
    width: 0,
  },
  visible: {
    opacity: 1,
    x: 0,
    width: "auto",
    transition: {
      duration: 0.24,
      delay: 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    x: -6,
    width: 0,
    transition: {
      duration: 0.18,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const SidebarBody = ({
  displayName,
  displayEmail,
  collapsed,
  onToggle,
  onClose,
  onLogout,
  onOpenSupport,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="sidebar-top-card">
        <div className="avatar-badge larger">{getInitials(displayName)}</div>

        <AnimatePresence initial={false}>
          {!collapsed ? (
            <Motion.div
              key="user-copy"
              variants={labelMotion}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="sidebar-user-copy"
            >
              <strong>{displayName}</strong>
              <span>{displayEmail}</span>
            </Motion.div>
          ) : null}
        </AnimatePresence>

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
        {menuItems.map((item) => {
          const CurrentIcon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : ""} ${
                  collapsed ? "sidebar-link-collapsed" : ""
                }`
              }
            >
              <CurrentIcon size={20} />
              <AnimatePresence initial={false}>
                {!collapsed ? (
                  <Motion.span
                    key={`${item.label}-label`}
                    variants={labelMotion}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </Motion.span>
                ) : null}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className={`sidebar-link ${collapsed ? "sidebar-link-collapsed" : ""}`}
          onClick={() => {
            onOpenSupport();
            onClose?.();
          }}
        >
          <CircleHelp size={20} />
          <AnimatePresence initial={false}>
            {!collapsed ? (
              <Motion.span
                key="support-label"
                variants={labelMotion}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="overflow-hidden whitespace-nowrap"
              >
                Support
              </Motion.span>
            ) : null}
          </AnimatePresence>
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
          <AnimatePresence initial={false}>
            {!collapsed ? (
              <Motion.span
                key="logout-label"
                variants={labelMotion}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="overflow-hidden whitespace-nowrap"
              >
                Logout
              </Motion.span>
            ) : null}
          </AnimatePresence>
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
  onOpenSupport,
  isMobileMenuOpen,
  onCloseMobile,
}) => {
  const displayName = user?.name || "Demo User";
  const displayEmail = user?.email || "aryan65@example.com";

  return (
    <>
      <Motion.aside
        animate={{ width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
        transition={sidebarTransition}
        className="sidebar-shell desktop-sidebar"
      >
        <SidebarBody
          displayName={displayName}
          displayEmail={displayEmail}
          collapsed={isCollapsed}
          onToggle={onToggle}
          onLogout={onLogout}
          onOpenSupport={onOpenSupport}
        />
      </Motion.aside>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <>
            <Motion.button
              type="button"
              className="mobile-sidebar-backdrop"
              onClick={onCloseMobile}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close navigation"
            />

            <Motion.aside
              className="mobile-sidebar-shell"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <SidebarBody
                displayName={displayName}
                displayEmail={displayEmail}
                collapsed={false}
                onToggle={onToggle}
                onClose={onCloseMobile}
                onLogout={onLogout}
                onOpenSupport={onOpenSupport}
              />
            </Motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
