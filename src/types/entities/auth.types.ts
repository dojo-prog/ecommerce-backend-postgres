import { UserPublic, UserRole } from "../../schemas/users";

// =======================================
// AUTH TOKENS PAYLOAD
// =======================================

export interface AccessTokenPayload {
  id: string;
  role: UserRole;
}

export type RefreshTokenPayload = Omit<AccessTokenPayload, "role">;

// =======================================
// SERVICE PARAMS
// =======================================

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RefreshAccessTokenParams {
  refreshToken: string;
}

// =======================================
// REPOSITORY DATA
// =======================================

export interface RegisterData {
  username: string;
  email: string;
  password_hash: string;
}

// =======================================
// RESULT
// =======================================

export interface RegisterResult {
  user: UserPublic;
  access_token: string;
  refresh_token: string;
}

export interface LoginResult extends RegisterResult {}
