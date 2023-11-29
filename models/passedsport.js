'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PassedSport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PassedSport.belongsTo(models.TrainRequest)
      models.TrainRequest.hasMany(PassedSport);
    }
  }
  PassedSport.init({
    trainRequestId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PassedSport',
    tableName: 'passedsports',

  });
  return PassedSport;
};