import React from 'react'
import { Outlet } from "react-router-dom";
import {styles} from "../assets/dummyStyles"
import Navbar from "./navbar"
const Layout = ({onLogout,user}) => {
  return (
    <div className={styles.layout.root}>
      <Navbar user={user} onLogout={onLogout} />
      <Outlet />
    </div>
  )
}

export default Layout
