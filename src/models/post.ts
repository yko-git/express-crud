import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";

import { sequelize } from ".";
import { User } from "./user";
import Category from "./category";

class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User["id"]>;
  declare title: string;
  declare body: string;
  declare status: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static async createPost(req: any, user: any) {
    const { post: params } = req.body;
    const { title, body, status, categoryIds } = params || {};
    const categories = await Category.findAll({
      where: {
        id: categoryIds,
      },
    });

    const post = {
      userId: user.id,
      title,
      body,
      status,
      categoryIds: categories,
    };

    return await Post.create(post);
  }

  static async updatePost(req: any) {
    const { post: params } = req.body;
    const { title, body, status } = params || {};

    const post = {
      title,
      body,
      status,
    };

    const param = req.params.id;
    const id = parseInt(param.slice(1, param.length), 10);

    return await Post.update(post, {
      where: {
        id: id,
      },
    });
  }
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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, modelName: "Post", tableName: "posts" }
);

export { Post };
