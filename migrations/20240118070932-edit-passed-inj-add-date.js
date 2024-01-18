'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('passedinjuries', 'date', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: false
    })
  },

  async down (queryInterface, Sequelize) {}
};
