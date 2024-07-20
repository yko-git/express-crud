import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import { sequelize } from ".";

class PostCategory extends Model<
  InferAttributes<PostCategory>,
  InferCreationAttributes<PostCategory>
> {
  declare postId: number;
  declare categoryId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

PostCategory.init(
  {
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
