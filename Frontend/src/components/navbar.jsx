import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";
import {navbarStyles} from "../assets/dummyStyles"
import img1 from "../assets/logo.png"

const Navbar = ({ user }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const displayName = user?.fullName || user?.name || "User";
    const displayEmail = user?.email || "user@expensetracker.com";
    const initial = displayName.charAt(0).toUpperCase();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

  return (
    <header className={navbarStyles.header}>
        <div className={navbarStyles.container}>
            <div onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer">
                <div className="h-12 w-12 overflow-hidden rounded-xl">
                    <img src={img1} alt="Logo" className="h-full w-full object-cover" />
                </div>
                <span className="text-2xl font-semibold text-slate-900 md:text-3xl">
                    Expense Tracker
                </span>
            </div>

            <div ref={menuRef} className={navbarStyles.userContainer}>
                <button
                    type="button"
                    onClick={() => setIsOpen((current) => !current)}
                    className={navbarStyles.userButton}
                >
                    <div className="relative">
                        <div className={navbarStyles.userAvatar}>{initial}</div>
                        <span className={navbarStyles.statusIndicator}></span>
                    </div>

                    <div className={navbarStyles.userTextContainer}>
                        <p className={navbarStyles.userName}>{displayName}</p>
                        <p className={navbarStyles.userEmail}>{displayEmail}</p>
                    </div>

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className={navbarStyles.chevronIcon(isOpen)}
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="m6 15 6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {isOpen && (
                    <div className={navbarStyles.dropdownMenu}>
                        <div className={`${navbarStyles.dropdownHeader} flex items-center gap-3`}>
                            <div className={navbarStyles.dropdownAvatar}>{initial}</div>
                            <div className="min-w-0">
                                <p className={`${navbarStyles.dropdownName} font-medium`}>
                                    {displayName}
                                </p>
                                <p className={`${navbarStyles.dropdownEmail} truncate`}>
                                    {displayEmail}
                                </p>
                            </div>
                        </div>

                        <div className={navbarStyles.menuItemContainer}>
                            <button
                                type="button"
                                className={navbarStyles.menuItem}
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate("/profile");
                                }}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="h-4 w-4"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M4 20a8 8 0 0 1 16 0"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span>My Profile</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>

    </header>
  )
}

export default Navbar;
