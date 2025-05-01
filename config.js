// config.js
import dotenv from "dotenv";
dotenv.config();

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-3.5-turbo";
export const DATAFORSEO_LOGIN = process.env.DATAFORSEO_LOGIN;
export const DATAFORSEO_PASSWORD = process.env.DATAFORSEO_PASSWORD;
