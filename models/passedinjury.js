'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PassedInjury extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PassedInjury.belongsTo(models.TrainRequest, {
        foreignKey: 'trainRequestId'
      })

    }
  }
  PassedInjury.init({
    name: DataTypes.STRING,
    alreadyEmbarrased: DataTypes.STRING,
    description: DataTypes.STRING,
    date: DataTypes.DATE

  }, {
    sequelize,
    modelName: 'PassedInjury',
  });
  return PassedInjury;
};