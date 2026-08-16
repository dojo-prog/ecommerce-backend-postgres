class AppError extends Error {
  statusCode: number;
  status: string;
  errors: Record<string, unknown> | null;

  constructor(
    statusCode = 500,
    message = "Internal Server Error",
    options = {},
  ) {
    super(message);

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace?.(this, this.constructor);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.errors = Object.keys(options).length > 0 ? options : null;
  }
}

export default AppError;
