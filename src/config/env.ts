import "dotenv/config";

// =======================================
// HELPER
// =======================================

const getReqEnvStr = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required env ${name}`);
  }

  return value;
};

const getReqEnvNum = (name: string, defVal?: number) => {
  const rawVal = process.env[name];

  if (!rawVal) {
    if (defVal !== undefined) {
      return defVal;
    }

    throw new Error(`Missing required env ${name}`);
  }

  const parsedVal = Number(rawVal);

  if (Number.isNaN(parsedVal)) {
    throw new Error(`Env ${name} must be a number`);
  }

  return parsedVal;
};

// =======================================
// ENV CONFIG MODULE
// =======================================

const ENV = {
  PORT: getReqEnvNum("PORT", 3000),
  NODE_ENV: getReqEnvStr("NODE_ENV"),
  BASE_URL: getReqEnvStr("BASE_URL"),

  DATABASE_HOST: getReqEnvStr("DATABASE_HOST"),
  DATABASE_PORT: getReqEnvNum("DATABASE_PORT", 5432),
  DATABASE_NAME: getReqEnvStr("DATABASE_NAME"),
  DATABASE_USER: getReqEnvStr("DATABASE_USER"),
  DATABASE_PASSWORD: getReqEnvStr("DATABASE_PASSWORD"),

  ACCESS_TOKEN_SECRET: getReqEnvStr("ACCESS_TOKEN_SECRET"),
  REFRESH_TOKEN_SECRET: getReqEnvStr("REFRESH_TOKEN_SECRET"),
} as const;

export default ENV;
