import express from "express";
import { getDashboardOverview } from "../controller/dashboardController.js";
import { authMiddleware } from "../middleware/auth.js";

const dashboardRouter = express.Router();
// Get dashboard overview
dashboardRouter.get("/overview", authMiddleware, getDashboardOverview);

export default dashboardRouter;