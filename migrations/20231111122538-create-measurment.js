'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Measurments', {
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
      sizeweight: {
        type: Sequelize.FLOAT
      },
      suroundShoulersweight: {
        type: Sequelize.FLOAT
      },
      suroundWaistweight: {
        type: Sequelize.FLOAT
      },
      suroundArmsweight: {
        type: Sequelize.FLOAT
      },
      suroundChestweight: {
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Measurments');
  }
};