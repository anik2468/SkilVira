import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import internshipRoutes from "./routes/internshipRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import studentProfileRoutes from "./routes/studentProfileRoutes.js";

const app = express();

// =======================
// Middlewares
// =======================
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

// =======================
// Static Folder
// =======================
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// =======================
// API Routes
// =======================
app.use("/api/auth", authRoutes);

app.use("/api/internships", internshipRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/student", studentRoutes);

app.use("/api/student-profile", studentProfileRoutes);

app.use("/api/applications", applicationRoutes);

// =======================
// Health Check
// =======================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 SkilVira API is running...",
  });
});

export default app;