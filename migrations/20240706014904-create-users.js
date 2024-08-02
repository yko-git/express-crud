"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      loginId: {
        type: Sequelize.STRING,
        validate: {
          notNull: true,
        },
      },
      authorizeToken: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "名前は必ず入力してください",
          },
        },
      },
      iconUrl: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "iconUrlは必ず入力してください",
          },
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
