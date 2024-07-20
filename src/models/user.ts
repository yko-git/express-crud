import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import Post from "./post";
import { sequelize } from ".";

class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare loginId: string;
  declare authorize_token: string;
  declare name: string;
  declare iconUrl: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    loginId: DataTypes.STRING,
    authorize_token: DataTypes.STRING,
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

User.hasMany(Post, {
  foreignKey: "userId",
});

Post.belongsTo(User, {
  foreignKey: "userId",
});

export default User;
