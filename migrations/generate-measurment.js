'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('measurments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      weight: {
        type: Sequelize.FLOAT
      },
      size: {
        type: Sequelize.FLOAT
      },
      suroundShoulers: {
        type: Sequelize.FLOAT
      },
      suroundWaist: {
        type: Sequelize.FLOAT
      },
      suroundArms: {
        type: Sequelize.FLOAT
      },
      suroundChest: {
        type: Sequelize.FLOAT
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
    await queryInterface.dropTable('measurments');
  }
};
