'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('nutritionrequirements', 'proteinMultiplicator', {
        type: Sequelize.FLOAT
        
    });
    await queryInterface.addColumn('nutritionrequirements', 'metabolismMultiplicator', {
        type: Sequelize.FLOAT
        
    });
    
    await queryInterface.addColumn('nutritionrequirements', 'personnalMultiplicator', {
        type: Sequelize.FLOAT
        
    });
    
    await queryInterface.addColumn('nutritionrequirements', 'fatMultiplicator', {
        type: Sequelize.FLOAT
        
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('nutritionrequirements');
  }
};