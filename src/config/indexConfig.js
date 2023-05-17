import { config } from "dotenv";

const { parsed } = config();

export const {
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_DATABASE,
  DB,
  PORT,
  PROD,
  SECRET,
  IN_PROD = PROD === "prod",
  BASE_URL = `http://localhost:${PORT}`,
} = parsed;
