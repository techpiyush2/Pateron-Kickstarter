import { Router } from "express";

import { verifyToken ,authorizeSubscribers} from "../middleware/AuthMiddleware.js";
import {
  confirmPaymentIntent,
  createPaymentIntent,
  getBuyerSubscription,
  getSellerSubscription,
} from "../controllers/subscriptionControllers.js";

export const subscriptionRoutes = Router();

subscriptionRoutes.post("/create", verifyToken, createPaymentIntent);
subscriptionRoutes.post("/success", verifyToken, confirmPaymentIntent);
subscriptionRoutes.post("/get-buyer-subscription", verifyToken, getBuyerSubscription);
subscriptionRoutes.post("/get-seller-subscription", verifyToken, authorizeSubscribers, getSellerSubscription);
