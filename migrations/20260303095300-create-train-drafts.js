'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('train_drafts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      name: {
        type: Sequelize.STRING,
      },

      description: {
        type: Sequelize.CHAR,
      },

      programDraftId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'program_drafts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('train_drafts');
  },
};