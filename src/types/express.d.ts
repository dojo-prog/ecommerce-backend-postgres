import { UserPublic } from "../schemas/users";

declare global {
  namespace Express {
    interface Request {
      user?: UserPublic;
    }
  }
}
