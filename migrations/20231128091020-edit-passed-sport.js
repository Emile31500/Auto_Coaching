'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    return Promise.all([
      
      queryInterface.addColumn('passedsports', 'startDate',{type : Sequelize.DATE, allowNull: false } ),
      queryInterface.addColumn('passedsports', 'endDate',{type : Sequelize.DATE, allowNull: false } )
    
    ]);

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
