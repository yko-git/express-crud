"use strict";

const data = [
  {
    key: "programming",
    name: "プログラミング",
  },
  {
    key: "career",
    name: "キャリア",
  },
  {
    key: "hobby",
    name: "趣味",
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    data.forEach((each) => {
      each.createdAt = new Date();
      each.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("categories", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
