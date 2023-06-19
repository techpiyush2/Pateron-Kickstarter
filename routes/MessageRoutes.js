import { Router } from "express";

import { verifyToken } from "../middleware/AuthMiddleware.js";
import {
  addMessage,
  getMessages,
  getUnreadMessages,
  markAsRead,
} from "../controllers/MessageControllers.js";

export const messageRoutes = Router();

messageRoutes.post("/add-message", verifyToken, addMessage);
messageRoutes.post("/get-messages", verifyToken, getMessages);
messageRoutes.post("/unread-messages", verifyToken, getUnreadMessages);
messageRoutes.post("/mark-as-read", verifyToken, markAsRead);
