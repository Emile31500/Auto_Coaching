'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProgramDraft extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProgramDraft.hasMany(models.TrainDraft, {
        foreignKey: {
          name : 'programDraftId',
          allowNull : false
        },
      })
      ProgramDraft.belongsTo(models.User, {
        foreignKey: {
          name : 'userId'
        },
      })
    }
  }
  ProgramDraft.init({
    name: DataTypes.STRING,
    description: DataTypes.CHAR,
  }, {
    sequelize,
    modelName: 'ProgramDraft',
    tableName: 'program_drafts'
  });
  return ProgramDraft
};
