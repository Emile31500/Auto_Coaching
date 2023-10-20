'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  
    return Promise.all([
      queryInterface.addColumn(
        'Food',
        'kcalorie',
        Sequelize.INTEGER
      ),
      queryInterface.changeColumn(
        'Food',
        'carbohydrate',
        Sequelize.FLOAT
      ),
      queryInterface.changeColumn(
        'Food',
        'proteine',
        Sequelize.FLOAT
      ),
      queryInterface.changeColumn(
        'Food',
        'fat',
        Sequelize.FLOAT
      ),queryInterface.changeColumn(
        'Food',
        'trans_fat',
        Sequelize.FLOAT
      )
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
