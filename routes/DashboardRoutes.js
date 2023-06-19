import { Router } from "express";

import { verifyToken,authorizeCreator } from "../middleware/AuthMiddleware.js";
import { getSellerData } from "../controllers/DashboardController.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/seller", verifyToken,authorizeCreator, getSellerData);

