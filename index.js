import express from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { tierRoutes } from "./routes/TierRoutes.js";
import { subscriptionRoutes } from "./routes/subscriptionRoutes.js";
import { messageRoutes } from "./routes/MessageRoutes.js";
import { dashboardRoutes } from "./routes/DashboardRoutes.js";
import {userRoutes} from "./routes/userRoutes.js"
import {categoryRoutes} from "./routes/CategoryRoutes.js"
import { postRoutes } from "./routes/postRoutes.js";
import { projectRoutes } from "./routes/projectRoutes.js";
import {materialRoutes} from "./routes/MaterialRouters.js"
import { rewardRoutes } from "./routes/RewardRoutes.js";
import { planRoutes } from "./routes/PlanRoutes.js";
config({
  path: "./config/config.env",
});

const app = express();
const port = process.env.PORT;


app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/user",userRoutes);
app.use("/api/tier",tierRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/category", categoryRoutes);
app.use("api/reward", rewardRoutes)
app.use("api/material",materialRoutes)
app.use("api/plan", planRoutes)
app.use("/api/project", projectRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/project", projectRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
