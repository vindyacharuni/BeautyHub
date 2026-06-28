import express from "express";
import { createOrder } from "../Controllers/orderController.js";
import { getOrders } from "../Controllers/orderController.js";
const orderRouter = express.Router();
orderRouter.post("/", createOrder);
orderRouter.get("/", getOrders);
export default orderRouter;
