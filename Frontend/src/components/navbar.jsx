import React from 'react'
import { useNavigate } from "react-router-dom";
import {navbarStyles} from "../assets/dummyStyles"
import img1 from "../assets/logo.png"
const Navbar = () => {
    const navigate = useNavigate();
  return (
    <header className={navbarStyles.header}>
        <div className={navbarStyles.logoContainer}>
            <div onClick={() => navigate("/")} className={navbarStyles.logoContainer}>
                <div className={navbarStyles.logoImage}>
                    <img src={img1} alt="Logo" />

                </div>
                <span>
                    
                </span>
            </div>
        </div>

    </header>
  )
}

export default Navbar;
