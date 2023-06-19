import { Router } from "express";

import { verifyToken ,authorizeCreator} from "../middleware/AuthMiddleware.js";
import {createReward, readReward, deleteReward, rewardList, updateReward} from "../controllers/RewardControllers.js";

export const rewardRoutes = Router();

rewardRoutes.post("/create", verifyToken, authorizeCreator, createReward);
rewardRoutes.post("/read", verifyToken, readReward );
rewardRoutes.post("/list", verifyToken, rewardList );
rewardRoutes.post("/update", verifyToken,authorizeCreator, updateReward );
rewardRoutes.post("/delete", verifyToken,authorizeCreator, deleteReward );