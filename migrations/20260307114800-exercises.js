'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('exercises', 'imageUrlPng',  { type: Sequelize.STRING })  
    await queryInterface.renameColumn('exercises', 'imageUrl', 'imageUrlGif');
  },

  async down(queryInterface) {
  },
};