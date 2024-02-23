'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      return Promise.all([ 
        queryInterface.addColumn('food', 'idUser', {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: {
              tableName: 'users'
            },
            key: 'id'
          },
          defaultValue: null
        }),
        queryInterface.addColumn('food', 'kcalorie', {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0
        })
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
