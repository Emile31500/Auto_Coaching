'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addConstraint('Measurments', {
        fields: ['userId'],
        type: 'foreign key',
        name: 'measurment_user_assoc',
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
