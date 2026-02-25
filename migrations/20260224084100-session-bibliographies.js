'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('SessionBibliographies', 'videoUrl')
    await queryInterface.removeColumn('SessionBibliographies', 'libele')
    await queryInterface.addColumn('SessionBibliographies', 'url',  { type: Sequelize.STRING }) 

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.renameTable('CurseDrafts', 'CurseDrawfts')

  }
};