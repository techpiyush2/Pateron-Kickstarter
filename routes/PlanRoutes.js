import { Router } from "express";

import { verifyToken,authorizeCreator } from "../middleware/AuthMiddleware.js";
import {create, update, read, deletePlan, list} from "../controllers/PlanControllers.js";

export const planRoutes = Router();

planRoutes.post("/create", verifyToken, authorizeCreator, create);
planRoutes.post("/read", verifyToken,  read );
planRoutes.post("/list", verifyToken, list );
planRoutes.post("/update", verifyToken, authorizeCreator, update );
planRoutes.post("/delete", verifyToken, authorizeCreator, deletePlan);