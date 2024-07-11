"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // users.belongsTo(models.posts, { foreignKey: "userId" });
    }
  }
  Users.init(
    {
      loginId: DataTypes.STRING,
      authorize_token: DataTypes.STRING,
      name: DataTypes.STRING,
      iconUrl: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
