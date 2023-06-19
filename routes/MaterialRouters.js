import { Router } from "express";

import { verifyToken,authorizeCreator } from "../middleware/AuthMiddleware.js";
import {create, read, deleteMaterial, list, update} from "../controllers/MaterialControllers.js";

export const materialRoutes = Router();

import {materialUpload} from "../middleware/multer.js";


materialRoutes.post("/create", verifyToken, authorizeCreator,materialUpload, create);
materialRoutes.post("/read", verifyToken, read );
materialRoutes.post("/list", verifyToken, list );
materialRoutes.post("/update", verifyToken, authorizeCreator,materialUpload,update );
materialRoutes.post("/delete", verifyToken,authorizeCreator, deleteMaterial);