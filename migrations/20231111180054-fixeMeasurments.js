'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('Measurments', 'sizeweight', 'size'),
      queryInterface.renameColumn('Measurments', 'suroundShoulersweight', 'suroundShoulers'),
      queryInterface.renameColumn('Measurments', 'suroundWaistweight', 'suroundWaist'),
      queryInterface.renameColumn('Measurments', 'suroundArmsweight', 'suroundArms'),
      queryInterface.renameColumn('Measurments', 'suroundChestweight', 'suroundChest')
    ]);

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
