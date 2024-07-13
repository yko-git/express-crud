import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import { sequelize } from "../utils";

class PostCategories extends Model<
  InferAttributes<PostCategories>,
  InferCreationAttributes<PostCategories>
> {
  declare postId: number;
  declare categoryId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

PostCategories.init(
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

export default PostCategories;
