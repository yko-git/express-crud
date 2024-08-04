import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasManyCreateAssociationMixin,
} from "sequelize";

import Post from "./post";
import { sequelize } from ".";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare usersId: CreationOptional<number>;
  declare id: CreationOptional<number>;
  declare loginId: number;
  declare authorizeToken: string;
  declare name: string;
  declare iconUrl: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare createPost: HasManyCreateAssociationMixin<Post, "userId">;
}

User.init(
  {
    usersId: DataTypes.INTEGER,
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    loginId: {
      allowNull: false,
      type: DataTypes.INTEGER,
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

User.hasMany(Post, {
  sourceKey: "id",
  foreignKey: "userId",
  constraints: false,
});
// Post.belongsTo(User);

export default User;
