import ENV from "../config/env";

export const AUTH_TOKENS = {
  ACCESS_TOKEN: {
    name: "access_token",
    cookieMaxAge: 24 * 60 * 60 * 1000,
  },
  REFRESH_TOKEN: {
    name: "refresh_token",
    cookieMaxAge: 3 * 24 * 60 * 60 * 1000,
  },
};

export const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite: "strict",
} as const;
