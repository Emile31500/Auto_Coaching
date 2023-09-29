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
      // define association here
    }
  }
  ExerciseTrain.init({
    exerciseId: DataTypes.INTEGER,
    trainId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ExerciseTrain',
  });
  return ExerciseTrain;
};