'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('food', 'sugar', {type: Sequelize.FLOAT, allowNull: false, defaultValue: false})
    ]);
  },

  async down (queryInterface, Sequelize) {
  }
};
