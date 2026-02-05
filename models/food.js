'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Food extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Food.belongsTo(models.User, {
        foreignKey : 'userId',
      })
    
    }
  }
  Food.init({
    name: DataTypes.STRING,
    kcalorie: DataTypes.FLOAT,
    carbohydrate: DataTypes.FLOAT,
    sugar: DataTypes.FLOAT,
    proteine: DataTypes.FLOAT,
    fat: DataTypes.FLOAT,
    trans_fat: DataTypes.FLOAT,
    is_meat: DataTypes.BOOLEAN,
    is_egg: DataTypes.BOOLEAN,
    is_milk: DataTypes.BOOLEAN,
    is_veggie: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Food',
    tableName: 'food',
  });
  return Food;
};