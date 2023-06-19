import { Router } from "express";

import { verifyToken,authorizeCreator } from "../middleware/AuthMiddleware.js";
import {createTier, readTier, deleteTier, tierList, updateTier} from "../controllers/TierController.js";

export const tierRoutes = Router();

tierRoutes.post("/create", verifyToken,authorizeCreator, createTier);
tierRoutes.post("/read", verifyToken, readTier );
tierRoutes.post("/list", verifyToken, tierList );
tierRoutes.post("/update", verifyToken,authorizeCreator, updateTier );
tierRoutes.post("/delete", verifyToken,authorizeCreator, deleteTier );