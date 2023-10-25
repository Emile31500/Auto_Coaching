'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AteFood extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AteFood.belongsTo(models.User)
      models.User.hasOne(AteFood);
    }
  }
  AteFood.init({
    foodId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    weight: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AteFood',
    tableName: 'atefoods'
  });
  return AteFood;
};