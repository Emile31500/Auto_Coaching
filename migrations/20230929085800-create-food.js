'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Food', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      carbohydrate: {
        type: Sequelize.INTEGER
      },
      proteine: {
        type: Sequelize.INTEGER
      },
      fat: {
        type: Sequelize.INTEGER
      },
      trans_fat: {
        type: Sequelize.INTEGER
      },
      is_meat: {
        type: Sequelize.BOOLEAN
      },
      is_milk: {
        type: Sequelize.BOOLEAN
      },
      is_egg: {
        type: Sequelize.BOOLEAN
      },
      is_veggie: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Food');
  }
};