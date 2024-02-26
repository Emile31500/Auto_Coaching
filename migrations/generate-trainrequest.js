'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('trainrequests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      objectif: {
        type: Sequelize.STRING,
        validate: {
          len: [0, 32]
        }
      },
      height: {
        type: Sequelize.INTEGER
      },
      weight: {
        type: Sequelize.INTEGER
      },
      metabolism: {
        type: Sequelize.STRING,
        validate: {
          len: [0, 32]
        }
      },
      description: {
        type: Sequelize.STRING,
        validate: {
          len: [0, 16384]
        }
      },
      birthDay: {
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
    await queryInterface.dropTable('trainrequests');
  }
};
