// =======================================
// AUTH TOKENS PAYLOAD
// =======================================

import { UserPublic, UserRole } from "../../schemas/users";

export interface AccessTokenPayload {
  id: string;
  role: UserRole;
}

export type RefreshTokenPayload = Omit<AccessTokenPayload, "role">;

// =======================================
// RESULT
// =======================================

export interface RegisterResult {
  user: UserPublic;
  access_token: string;
  refresh_token: string;
}

export interface LoginResult extends RegisterResult {}
