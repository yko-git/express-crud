import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";

import Post from "./post";
import { sequelize } from ".";
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
    },
    postId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    createdAt: DataTypes.NOW,
    updatedAt: DataTypes.NOW,
  },
  {
    tableName: "PostCategories",
    sequelize,
  }
);

export default PostCategory;
