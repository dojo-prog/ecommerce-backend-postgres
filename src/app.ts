import express from "express";
import errorMiddleware from "./middlewares/error.middleware";
import cookieParser from "cookie-parser";

import authRouter from "./routers/auth.routes";

const app = express();

// Parsers
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Routers
app.use("/api/v1/auth", authRouter);

// Error Handler
app.use(errorMiddleware);

export default app;
