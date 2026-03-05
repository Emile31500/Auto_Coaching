'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('trains', 'programId',  { type: Sequelize.INTEGER })  
    await queryInterface.addColumn('programs', 'programDraftId',  { type: Sequelize.INTEGER }) 
    await queryInterface.removeColumn('exercisetrains', 'isFinished') 
    await queryInterface.removeColumn('exercisetrains', 'trainRequestId') 
    await queryInterface.removeColumn('exercisetrains', 'day')
  },

  async down(queryInterface) {
  },
};