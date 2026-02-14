'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'birthDay', {
        type: Sequelize.DATEONLY
        
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'birthDay', {});
  }
};