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

  async createPost(categoryIds: number[]) {
    const categories = await Category.findAll({
      where: {
        id: categoryIds,
      },
    });
    await this.save();

    const categoryPromise = categories.map((category) =>
      PostCategory.create({
        postId: this.id,
        categoryId: category.id,
      })
    );
    await Promise.all(categoryPromise);

    return this;
  }

  async updatePost(params: any) {
    const { title, body, status, categoryIds } = params || {};
    this.set({
      title,
      body,
      status,
    });

    await PostCategory.destroy({
      where: {
        postId: this.id,
      },
    });

    if (categoryIds && categoryIds.length > 0) {
      const categoryIdsPromise = categoryIds.map((categoryId: number) =>
        PostCategory.create({
          postId: this.id,
          categoryId,
        })
      );
      await Promise.all(categoryIdsPromise);
    }
    return await this.save();
  }

  async deletePost() {
    await PostCategory.destroy({
      where: {
        postId: this.id,
      },
    });
    return await Post.destroy({
      where: {
        id: this.id,
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
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  { sequelize, modelName: "Post", tableName: "posts" }
);

Post.belongsToMany(Category, { through: "post_categories" });
Category.belongsToMany(Post, { through: "post_categories" });

export { Post };
