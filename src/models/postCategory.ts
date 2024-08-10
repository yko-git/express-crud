import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";

import { sequelize } from ".";
import { Post } from "./post";
import Category from "./category";

class PostCategory extends Model<
  InferAttributes<PostCategory>,
  InferCreationAttributes<PostCategory>
> {
  declare id: CreationOptional<number>;
  declare postId: ForeignKey<Post["id"]>;
  declare categoryId: ForeignKey<Category["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

PostCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    postId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: { notNull: true },
    },
    categoryId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: { notNull: true },
    },
    createdAt: DataTypes.NOW,
    updatedAt: DataTypes.NOW,
  },
  {
    sequelize,
    tableName: "post_categories",
  }
);

export default PostCategory;
