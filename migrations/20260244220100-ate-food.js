'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('atefoods', 'date', {
        type: Sequelize.DATEONLY
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('atefoods');
  }
};