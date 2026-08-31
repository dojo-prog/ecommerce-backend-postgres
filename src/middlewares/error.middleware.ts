import { ErrorRequestHandler } from "express";
import ENV from "../config/env";
import AppError from "../utils/AppError";

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  const isProduction = ENV.NODE_ENV === "production";

  let statusCode: number = 500;
  let message: string = "Internal Server Error";
  let errors: Record<string, unknown> | null = null;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (!isProduction && err instanceof Error) {
    message = err.message;
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  const response: Record<string, unknown> = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  if (!isProduction) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorMiddleware;
