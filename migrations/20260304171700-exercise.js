'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('exercises', 'imageUrl',  { type: Sequelize.STRING }) 
    await queryInterface.addColumn('programs', 'imageUrl',  { type: Sequelize.STRING }) 
    await queryInterface.addColumn('program_drafts', 'imageUrl',  { type: Sequelize.STRING }) 
    await queryInterface.addColumn('trains', 'imageUrl',  { type: Sequelize.STRING }) 
    await queryInterface.addColumn('train_drafts', 'imageUrl',  { type: Sequelize.STRING }) 



  },

  async down(queryInterface) {
    await queryInterface.removeColumn('exercises', 'imageUrl') 
    await queryInterface.removeColumn('programs', 'imageUrl') 
    await queryInterface.removeColumn('program_drafts', 'imageUrl') 
    await queryInterface.removeColumn('trains', 'imageUrl') 
    await queryInterface.removeColumn('train_drafts', 'imageUrl') 
  },
};