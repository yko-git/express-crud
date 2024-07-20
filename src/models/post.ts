import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import Category from "./category";
import { sequelize } from ".";

class Post extends Model<
  InferAttributes<Post>,
  InferCreationAttributes<Post>
> {
  declare userId: number;
  declare title: string;
  declare body: string;
  declare status: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Post.init(
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

Category.belongsToMany(Post, {
  through: "PostCategories",
  foreignKey: "categoryId",
});

Post.belongsToMany(Category, {
  through: "PostCategories",
  foreignKey: "postId",
});

export default Post;
