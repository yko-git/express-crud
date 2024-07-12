"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Categories.belongsToMany(models.Categories, {
        through: "postCategories",
        foreignKey: "categoryId",
      });
    }
  }
  Categories.init(
    {
      key: DataTypes.STRING,
      name: DataTypes.STRING,
      createdAt: DataTypes.NOW,
      updatedAt: DataTypes.NOW,
    },
    {
      sequelize,
      modelName: "Categories",
    }
  );
  return Categories;
};
