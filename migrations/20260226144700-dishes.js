'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.removeColumn('Dishes', 'sumKcalorie')
    await queryInterface.removeColumn('Dishes', 'sumProtein')
    await queryInterface.removeColumn('Dishes', 'sumFat')
    await queryInterface.removeColumn('Dishes', 'sumCarbohydrate')
    await queryInterface.addColumn('Dishes', 'sumKcalorie',  { type: Sequelize.INTEGER }) 
    await queryInterface.addColumn('Dishes', 'sumProtein',  { type: Sequelize.INTEGER }) 
    await queryInterface.addColumn('Dishes', 'sumFat',  { type: Sequelize.INTEGER }) 
    await queryInterface.addColumn('Dishes', 'sumCarbohydrate',  { type: Sequelize.INTEGER }) 
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Dishes', 'sumKcalorie')
    await queryInterface.removeColumn('Dishes', 'sumProtein')
    await queryInterface.removeColumn('Dishes', 'sumFat')
    await queryInterface.removeColumn('Dishes', 'sumCarbohydrate')
  }
};