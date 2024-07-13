import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import Posts from "./posts";
import { sequelize } from "../utils";

class Users extends Model<
  InferAttributes<Users>,
  InferCreationAttributes<Users>
> {
  declare loginId: string;
  declare authorize_token: string;
  declare name: string;
  declare iconUrl: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Users.init(
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

Users.belongsTo(Posts, {
  foreignKey: "userId",
});

export default Users;
