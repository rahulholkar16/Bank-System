import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js";
import AuthRoutes from "./routes/auth.route.js";
import cookiesParser from "cookie-parser";

const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookiesParser());
app.use(cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/api/v1/auth", AuthRoutes);
app.use(errorHandler);
export default app;