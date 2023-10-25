'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NutritionRequirement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      NutritionRequirement.belongsTo(models.User)
      models.User.hasOne(NutritionRequirement);
    }
  }
  NutritionRequirement.init({
    kcalorie: DataTypes.INTEGER,
    proteine: DataTypes.INTEGER,
    fat: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'NutritionRequirement',
    tableName: 'nutritionrequirements'
  });
  return NutritionRequirement;
};