import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "mysql://root:root@'%':3306/database_development"
);
