import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import Post from "./post";
import { sequelize } from ".";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: number;
  declare loginId: string;
  declare authorizeToken: string;
  declare name: string;
  declare iconUrl: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notNull: true,
      },
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
    createdAt: DataTypes.NOW,
    updatedAt: DataTypes.NOW,
  },
  {
    tableName: "Users",
    sequelize,
  }
);

User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User);

export default User;
