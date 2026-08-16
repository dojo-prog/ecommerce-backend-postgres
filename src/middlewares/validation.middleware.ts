import { ZodTypeAny } from "zod";
import AppError from "../utils/AppError";
import { Middleware } from "../types/handlers";

interface ValidationSchema {
  params?: ZodTypeAny;
  query?: ZodTypeAny;
  body?: ZodTypeAny;
}

// =======================================
// HELPER
// =======================================
const validateSchema = (schema: ZodTypeAny, data: Record<string, unknown>) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const firstError = result.error.issues[0];

    throw new AppError(400, firstError.message, fieldErrors);
  }

  return result.data;
};

// =======================================
// VALIDATION HANDLER
// =======================================

const validate = (schemas: ValidationSchema): Middleware => {
  return (req, res, next) => {
    // =======================================
    // REQ PARAMS VALIDATION
    // =======================================

    if (schemas.params) {
      req.params = validateSchema(
        schemas.params,
        req.params,
      ) as typeof req.params;
    }

    // =======================================
    // REQ QUERY VALIDATION
    // =======================================

    if (schemas.query) {
      Object.assign(req.query, validateSchema(schemas.query, req.query));
    }

    // =======================================
    // REQ BODY VALIDATION
    // =======================================

    if (schemas.body) {
      req.body = validateSchema(schemas.body, req.body);
    }

    next();
  };
};

export default validate;
