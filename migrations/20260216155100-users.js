'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'objectiv', {
        type: Sequelize.INTEGER
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'objectiv', {});
  }
};