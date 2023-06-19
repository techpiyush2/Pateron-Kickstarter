import { Router } from "express";

import { verifyToken,authorizeCreator } from "../middleware/AuthMiddleware.js";
import {createCategory, readCategory, deleteCategory, categoryList, updateCategory} from "../controllers/CategoryControllers.js";

export const categoryRoutes = Router();

categoryRoutes.post("/create", verifyToken, authorizeCreator, createCategory);
categoryRoutes.post("/read", verifyToken, readCategory );
categoryRoutes.post("/list", verifyToken, categoryList );
categoryRoutes.post("/update", verifyToken,authorizeCreator, updateCategory );
categoryRoutes.post("/delete", verifyToken,authorizeCreator,deleteCategory );