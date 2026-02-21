'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable('CurseDrawfts', 'CurseDrafts')
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.renameTable('CurseDrafts', 'CurseDrawfts')

  }
};