import path from "path";
import { Sequelize } from "sequelize";
import Users from "./users";
import Categories from "./categories";
import PostCategories from "./postCategories";
import Posts from "./posts";

const config = require(path.join(__dirname, "/../config/config.js"));

export const sequelize = new Sequelize(config);

const models = {
  Users,
  Categories,
  PostCategories,
  Posts,
};

export type Models = typeof models;

export default models;
