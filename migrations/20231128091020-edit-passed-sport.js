'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    return Promise.all([
      
      queryInterface.addColumn('passedsports', 'startDate', Sequelize.DATE ),
      queryInterface.addColumn('passedsports', 'endDate', Sequelize.DATE )
    
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
