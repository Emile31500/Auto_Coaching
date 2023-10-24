'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'AteFoods',
        'userId',
        Sequelize.INTEGER
      ),
      queryInterface.addConstraint('AteFoods', {
        fields: ['userId'],
        type: 'foreign key',
        name: 'ate_food_user_assoc',
        references: {
          table: 'Users',
          field: 'id'
        }
      })
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
