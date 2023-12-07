'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('train', 'isFinished', {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false}),
      queryInterface.addColumn('train', 'trainRequestId', {type: Sequelize.INTEGER, allowNull: false,}),
      queryInterface.addColumn('exercisetrains', 'sets', {type: Sequelize.INTEGER, allowNull: false,}),
      queryInterface.addColumn('exercisetrains', 'reps', {type: Sequelize.INTEGER, allowNull: false,}),
      queryInterface.addColumn('exercisetrains', 'repsMode', {type: Sequelize.STRING(5), allowNull: false,}),
      queryInterface.addColumn('exercisetrains', 'day', {type: Sequelize.STRING(8), allowNull: false,})
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
