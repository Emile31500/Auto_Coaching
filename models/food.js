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
      // define association here
    }
  }
  Food.init({
    name: DataTypes.STRING,
    carbohydrate: DataTypes.INTERGER,
    proteine: DataTypes.INTERGER,
    fat: DataTypes.INTERGER,
    trans_fat: DataTypes.INTERGER,
    is_meat: DataTypes.BOOLEAN,
    is_milk: DataTypes.BOOLEAN,
    is_egg: DataTypes.BOOLEAN,
    is_veggie: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Food',
  });
  return Food;
};