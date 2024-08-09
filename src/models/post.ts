import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";

import Category from "./category";
import { sequelize } from ".";
import { User } from "./user";

class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User["id"]>;
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
    userId: DataTypes.INTEGER,
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
    sequelize,
    tableName: "posts",
  }
);

Category.belongsToMany(Post, {
  through: {
    model: sequelize.define(
      "PostCategories",
      {},
      {
        tableName: "post_categories",
      }
    ),
  },
  foreignKey: "categoryId",
});

Post.belongsToMany(Category, {
  through: {
    model: sequelize.define(
      "PostCategories",
      {},
      {
        tableName: "post_categories",
      }
    ),
  },
  foreignKey: "postId",
});

// /posts post
async function getPost(req: any, user: any) {
  const { post: params } = req.body;
  const { title, body, status, categoryIds } = params || {};

  // const categories = await Category.findAll({
  //   where: {
  //     id: categoryIds,
  //   },
  // });

  const post = {
    userId: user.id,
    title,
    body,
    status,
    // categoryIds: categories,
    categoryIds,
  };

  return post;
}

export { Post, getPost };
