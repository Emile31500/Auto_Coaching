'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExerciseTrainDraft extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ExerciseTrainDraft.belongsTo(models.TrainDraft, {
        foreignKey: 'trainDraftId',
      })

      ExerciseTrainDraft.belongsTo(models.Exercise, {
        foreignKey : 'exerciseId'
      })
    }
  }
  ExerciseTrainDraft.init({
    repsMode: DataTypes.STRING(5),
    day: DataTypes.STRING(8),
    reps: DataTypes.INTEGER,
    sets: DataTypes.INTEGER,
    ordering: DataTypes.INTEGER,
    
  }, {
    sequelize,
    modelName: 'ExerciseTrainDraft',
    tableName: 'exercise_train_drafts'
  });
  return ExerciseTrainDraft;
};