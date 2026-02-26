'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('SessionBibliographies', 'libele',  { type: Sequelize.STRING })
    await queryInterface.addColumn('SessionBibliographyDrafts', 'libele',  { type: Sequelize.STRING })

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('SessionBibliographies', 'libele')
    await queryInterface.removeColumn('SessionBibliographyDrafts', 'libele')

  }
};