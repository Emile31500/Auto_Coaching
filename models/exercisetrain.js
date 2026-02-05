'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExerciseTrain extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ExerciseTrain.belongsTo(models.Train, {
        foreignKey: 'trainId',
      })

      ExerciseTrain.belongsTo(models.Exercise, {
        foreignKey : 'exerciseId'
      })
    }
  }
  ExerciseTrain.init({
    repsMode: DataTypes.STRING(5),
    day: DataTypes.STRING(8),
    reps: DataTypes.INTEGER,
    sets: DataTypes.INTEGER,
    
  }, {
    sequelize,
    modelName: 'ExerciseTrain',
    tableName: 'exercisetrains'
  });
  return ExerciseTrain;
};