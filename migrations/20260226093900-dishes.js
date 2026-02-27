'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Dishes', 'sumKcalorie',  { type: Sequelize.STRING }) 
    await queryInterface.addColumn('Dishes', 'sumProtein',  { type: Sequelize.STRING }) 
    await queryInterface.addColumn('Dishes', 'sumFat',  { type: Sequelize.STRING }) 
    await queryInterface.addColumn('Dishes', 'sumCarbohydrate',  { type: Sequelize.STRING }) 
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Dishes', 'sumKcalorie')
    await queryInterface.removeColumn('Dishes', 'sumProtein')
    await queryInterface.removeColumn('Dishes', 'sumFat')
    await queryInterface.removeColumn('Dishes', 'sumCarbohydrate')
  }
};