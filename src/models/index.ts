import { Sequelize } from "sequelize";
// import config from "../config/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

export const sequelize = new Sequelize(databaseUrl, {
  dialect: "mysql",
  logging: false,
});
