'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Measurment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Measurment.init({
    userId: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    weight: DataTypes.FLOAT,
    rmSquat: DataTypes.FLOAT,
    rmBench: DataTypes.FLOAT,
    rmDeadlift: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Measurment',
  });
  return Measurment;
};