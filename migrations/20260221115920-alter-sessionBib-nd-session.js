'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Sessions', 'curseId', {
        type: Sequelize.INTEGER
    });
    await queryInterface.addColumn('SessionBibliographies', 'sessionId', {
        type: Sequelize.INTEGER
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Sessions', 'curseId')
    await queryInterface.removeColumn('SessionBibliographies', 'sessionId');

  }
};