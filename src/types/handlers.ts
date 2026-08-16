import { NextFunction, Request, Response } from "express";

type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void> | void;

type Controller = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export { Middleware, Controller };
