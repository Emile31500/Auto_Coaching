'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('exercisetrains', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      repsMode: {
        type: Sequelize.STRING(5)
      },
      day: {
        type: Sequelize.STRING(8)
      },
      exerciseId: {
        type: Sequelize.INTEGER
      },
      reps: {
        type: Sequelize.INTEGER
      },
      sets: {
        type: Sequelize.INTEGER
      },
      trainId: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('exercisetrains');
  }
};
