import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import Categories from "./categories";
import { sequelize } from "../utils";

class Posts extends Model<
  InferAttributes<Posts>,
  InferCreationAttributes<Posts>
> {
  declare userId: number;
  declare title: string;
  declare body: string;
  declare status: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Posts.init(
  {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    status: DataTypes.INTEGER,
    createdAt: DataTypes.NOW,
    updatedAt: DataTypes.NOW,
  },
  {
    tableName: "Posts",
    sequelize,
  }
);

Posts.belongsToMany(Categories, {
  through: "PostCategories",
  foreignKey: "postId",
});

export default Posts;
