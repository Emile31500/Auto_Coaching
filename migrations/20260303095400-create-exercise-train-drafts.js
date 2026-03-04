'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exercise_train_drafts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      repsMode: {
        type: Sequelize.STRING(5),
      },

      day: {
        type: Sequelize.STRING(8),
      },

      reps: {
        type: Sequelize.INTEGER,
      },

      sets: {
        type: Sequelize.INTEGER,
      },

      trainDraftId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'train_drafts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      exerciseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'exercises',
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
    await queryInterface.dropTable('exercise_train_drafts');
  },
};