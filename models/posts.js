"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      posts.hasMany(models.users, { foreignKey: "id" });
      posts.belongsToMany(models.categories, {
        through: "post_categories",
        foreignKey: "postId",
      });
    }
  }
  posts.init(
    {
      userId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      body: DataTypes.TEXT,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "posts",
    }
  );
  return posts;
};
