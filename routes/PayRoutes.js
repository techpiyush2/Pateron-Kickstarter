const express = require('express');
const payRouter = express.Router();
const {  createCustomer, createPaymentIntent} = require('../controllers/PayControllers.js');
import { verifyToken } from "../middleware/AuthMiddleware.js";

payRouter.post('/createCustomer', verifyToken, createCustomer);
payRouter.post('/createPaymentIntent', verifyToken, createPaymentIntent);
payRouter.post('/confirmPaymentIntent', verifyToken, confirmPaymentIntent);

export default payRouter