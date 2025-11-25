import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import campRoutes from "./routes/campRoutes.js";
import screeningRoutes from "./routes/screeningRoutes.js";
import organizerRoutes from "./routes/organizerRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/camps", campRoutes);
app.use("/api/screening",screeningRoutes);
app.use("/api/organizers", organizerRoutes);
app.get("/", (req, res) => {
  res.send("API is running");
});
app.listen(5001, () => console.log("Server running on port 5001"));
