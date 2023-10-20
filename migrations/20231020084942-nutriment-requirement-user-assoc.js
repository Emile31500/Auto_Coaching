'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint('NutritionRequirements', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'nutrition_requirements_user_assoc',
      references: {
        table: 'User',
        field: 'id'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint('NutritionRequirements', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'nutrition_requirements_user_assoc',
      references: {
        table: 'User',
        field: 'id'
      }
    });
  }
};
