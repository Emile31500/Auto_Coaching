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
      Measurment.belongsTo(models.User, {
        foreignKey : 'userId'
      })
    }
  }
  Measurment.init({
    weight: DataTypes.FLOAT,
    size: DataTypes.FLOAT,
    suroundShoulers: DataTypes.FLOAT,
    suroundWaist: DataTypes.FLOAT,
    suroundArms: DataTypes.FLOAT,
    suroundChest: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Measurment',
    tableName: 'measurments'

  });
  return Measurment;
};