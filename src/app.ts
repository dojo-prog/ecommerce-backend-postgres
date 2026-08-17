import express from "express";
import errorMiddleware from "./middlewares/error.middleware";
import cookieParser from "cookie-parser";

import authRouter from "./routers/auth.routes";
import addressRouter from "./routers/address.routes";
import storeRouter from "./routers/store.routes";
import shippingRouter from "./routers/shipping.routes";

const app = express();

// Parsers
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/addresses", addressRouter);
app.use("/api/v1/store", storeRouter);
app.use("/api/v1/shipping", shippingRouter);

// Error Handler
app.use(errorMiddleware);

export default app;
