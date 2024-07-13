import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import Posts from "./posts";
import { sequelize } from "../utils";

class Categories extends Model<
  InferAttributes<Categories>,
  InferCreationAttributes<Categories>
> {
  declare key: string;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Categories.init(
  {
    key: DataTypes.STRING,
    name: DataTypes.STRING,
    createdAt: DataTypes.NOW,
    updatedAt: DataTypes.NOW,
  },
  {
    tableName: "Categories",
    sequelize,
  }
);

Categories.belongsToMany(Posts, {
  through: "PostCategories",
  foreignKey: "categoryId",
});

export default Categories;
