import { Router } from "express";

import { verifyToken,authorizeCreator } from "../middleware/AuthMiddleware.js";
import {create, update, read, deletedProject, list} from "../controllers/ProjectControllers.js";

export const projectRoutes = Router();

projectRoutes.post("/create", verifyToken, authorizeCreator, create);
projectRoutes.post("/read", verifyToken, read );
projectRoutes.post("/list", verifyToken, list );
projectRoutes.post("/update", verifyToken,authorizeCreator, update );
projectRoutes.post("/delete", verifyToken,authorizeCreator, deletedProject );