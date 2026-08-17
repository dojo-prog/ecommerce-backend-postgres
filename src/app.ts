import express from "express";
import errorMiddleware from "./middlewares/error.middleware";
import cookieParser from "cookie-parser";

const app = express();

// Parsers
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Routers

// Error Handler
app.use(errorMiddleware);

export default app;
