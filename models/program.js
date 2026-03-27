'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Program extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Program.belongsTo(models.ProgramDraft, 
        {
        foreignKey: {
          name : 'programDraftId',
          allowNull : false
        },
      })
      Program.hasMany(models.Train, 
        {
        foreignKey: {
          name : 'programId',
          allowNull : false
        },
      })
      Program.belongsTo(models.User, 
        {
        foreignKey: {
          name : 'userId'
        },
      })
    }
  }
  Program.init({
    name: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    description: DataTypes.CHAR,
    programDraftId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Program',
    tableName: 'programs'
  });
  return Program
};
