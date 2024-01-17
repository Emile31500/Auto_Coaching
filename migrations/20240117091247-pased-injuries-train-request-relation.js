'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.changeColumn('passedinjuries', 'trainRequestId', {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'trainrequests'
          },
          key: 'id'
        },
        allowNull: false

    })
  },

  async down (queryInterface, Sequelize) {
  }
};
