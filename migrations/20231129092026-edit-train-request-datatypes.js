'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      

      queryInterface.addColumn('trainrequests', 'birthDay', {
        type: Sequelize.DATE,
        allowNull: false
      }),
      queryInterface.changeColumn('trainrequests', 'weight', {
        type: Sequelize.FLOAT,
        allowNull: false
      }),
      queryInterface.changeColumn('trainrequests', 'height', {
        type: Sequelize.FLOAT,
        allowNull: false
      }),
    
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
