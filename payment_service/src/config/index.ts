import dotenv from 'dotenv'

dotenv.config()

export const DB_URL = process.env.DB_URL;
export const APP_PORT = process.env.APP_PORT;
export const CLIENT_ID = process.env.CLIENT_ID;
export const BROKERS = process.env.BROKERS?.split(",") || [];
export const GROUP_ID = process.env.GROUP_ID;