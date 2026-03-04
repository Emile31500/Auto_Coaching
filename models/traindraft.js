'use strict';



const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TrainDraft extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TrainDraft.belongsTo(models.ProgramDraft, {
        foreignKey: {
          name : 'programDraftId'
        },
      })
      TrainDraft.hasMany(models.ExerciseTrainDraft, {
        foreignKey: {
          name : 'trainDraftId',
          allowNull : false
        },
      })
    }
  }
  TrainDraft.init({
    name: DataTypes.STRING,
    description: DataTypes.CHAR,
  }, {
    sequelize,
    modelName: 'TrainDraft',
    tableName: 'train_drafts'
  });
  return TrainDraft
};
