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
import PostCategory from "./postCategory";

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

Post.belongsToMany(Category, {
  through: PostCategory,
  foreignKey: "postId",
  otherKey: "categoryId",
});

Category.belongsToMany(Post, {
  through: PostCategory,
  foreignKey: "categoryId",
  otherKey: "postId",
});

export { Post };
