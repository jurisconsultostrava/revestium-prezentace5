import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app: Express = express();

app.set("trust proxy", 1);

const allowedOrigins = process.env["ALLOWED_ORIGINS"]
  ? process.env["ALLOWED_ORIGINS"].split(",")
  : ["*"];

app.use(helmet());
app.use(cors({
  origin: allowedOrigins.includes("*") ? "*" : allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Zu viele Anfragen. Bitte später erneut versuchen." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Zu viele Login-Versuche. Bitte später erneut versuchen." },
});

app.use("/api", limiter);
app.use("/api/auth", authLimiter);

app.use("/api", router);

app.use(errorHandler);

export default app;
