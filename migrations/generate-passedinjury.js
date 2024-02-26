'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PassedInjuries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      trainRequestId: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      alreadyEmbarrased: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PassedInjuries');
  }
};
