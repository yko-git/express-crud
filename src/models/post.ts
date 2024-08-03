import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import Category from "./category";
import { sequelize } from ".";

class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<number>;
  declare userId: string;
  declare title: string;
  declare body: string;
  declare status: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: DataTypes.STRING,
    title: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: "タイトルは必ず入力してください",
        },
      },
    },
    body: {
      allowNull: false,
      type: DataTypes.TEXT,
      validate: {
        notNull: {
          msg: "本文は必ず入力してください",
        },
      },
    },
    status: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notNull: {
          msg: "ステータスは必ず入力してください",
        },
      },
    },
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
