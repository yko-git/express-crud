import path from "path";
import { Sequelize } from "sequelize";

const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, "/../config/config.json"))[env];

export const sequelize = new Sequelize(config);

import Users from "./users";
import Categories from "./categories";
import PostCategories from "./postCategories";
import Posts from "./posts";

const models = {
  Users,
  Categories,
  PostCategories,
  Posts,
};

export type Models = typeof models;

export default models;
