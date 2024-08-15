import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasManyCreateAssociationMixin,
} from "sequelize";

import { Post } from "./post";
import { sequelize } from ".";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare loginId: number;
  declare authorizeToken: string;
  declare name: string;
  declare iconUrl: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare createPost: HasManyCreateAssociationMixin<Post, "userId">;
  async getUserPost(status: any) {
    if (status) {
      return await Post.findAll({
        where: {
          userId: this.id,
          status: status,
        },
      });
    }
    return await Post.findAll({
      where: {
        userId: this.id,
      },
    });
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    loginId: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true,
      },
    },
    authorizeToken: DataTypes.STRING,
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: "名前は必ず入力してください",
        },
      },
    },
    iconUrl: {
      allowNull: false,
      type: DataTypes.TEXT,
      validate: {
        notNull: {
          msg: "iconUrlは必ず入力してください",
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
  { sequelize, modelName: "User", tableName: "users" }
);

User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

export { User };
