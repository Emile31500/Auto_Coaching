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
      ExerciseTrain.belongsTo(models.Train)
      models.Train.hasOne(ExerciseTrain);

      ExerciseTrain.belongsTo(models.Exercise)
      models.Exercise.hasOne(ExerciseTrain);
    }
  }
  ExerciseTrain.init({
    repsMode: DataTypes.STRING(5),
    day: DataTypes.STRING(8),
    exerciseId: DataTypes.INTEGER,
    reps: DataTypes.INTEGER,
    sets: DataTypes.INTEGER,
    trainId: DataTypes.INTEGER
    
  }, {
    sequelize,
    modelName: 'ExerciseTrain',
    tableName: 'exercisetrains'
  });
  return ExerciseTrain;
};