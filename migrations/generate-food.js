'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('food', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      kcalorie: {
        type: Sequelize.FLOAT
      },
      carbohydrate: {
        type: Sequelize.FLOAT
      },
      sugar: {
        type: Sequelize.FLOAT
      },
      proteine: {
        type: Sequelize.FLOAT
      },
      fat: {
        type: Sequelize.FLOAT
      },
      trans_fat: {
        type: Sequelize.FLOAT
      },
      is_meat: {
        type: Sequelize.BOOLEAN
      },
      is_egg: {
        type: Sequelize.BOOLEAN
      },
      is_milk: {
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('food');
  }
};
