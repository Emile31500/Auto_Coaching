'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('measurments', 'date',  { type: Sequelize.DATEONLY })
  },

  async down(queryInterface) {
    await queryInterface.removeColumnColumn('measurments', 'date', {})
  },
};