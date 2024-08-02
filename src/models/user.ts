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
    id: DataTypes.INTEGER,
    loginId: DataTypes.STRING,
    authorizeToken: DataTypes.STRING,
    name: DataTypes.STRING,
    iconUrl: DataTypes.TEXT,
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
