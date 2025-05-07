// server.js (converted to full ES Module)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import trendsRoutes from "../routes/trends.js";
import analyzeRoute from "../routes/analyze.js";
import feedbackRoute from "../routes/feedback.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/trends", trendsRoutes);
app.use("/api/analyze-trends", analyzeRoute);
app.use("/api/insight-feedback", feedbackRoute);

const PORT = 3001;
export default app;
