'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exercise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Exercise.hasMany(models.ExerciseTrain, {
        foreignKey : {
          name : 'exerciseId',
          allowNull : false
        }
      })
      Exercise.hasMany(models.ExerciseTrainDraft, {
        foreignKey : {
          name : 'exerciseId',
          allowNull : false
        }
      })
    }
  }
  Exercise.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Exercise',
    tableName: 'exercises'

  });
  return Exercise;
};