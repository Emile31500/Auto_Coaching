'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Dish.belongsTo(models.User, {
        foreignKey : 'userId',
      })
      Dish.hasMany(models.DishFood, {
        foreignKey: 'dishId',
      })
    }

    async calculateSumMacro() {

        let calcSumKcalorie = 0
        let calcSumProtein = 0
        let calcSumFat = 0
        let calcSumCarbohydrate = 0
        let weightFactor = 0

        this.DishFoods.forEach(DishFood => {

          weightFactor = (DishFood.weight/100)
          calcSumCarbohydrate += weightFactor * DishFood.Food.carbohydrate; 
          calcSumFat += weightFactor * DishFood.Food.fat; 
          calcSumProtein += weightFactor * DishFood.Food.proteine; 
          calcSumKcalorie += weightFactor * DishFood.Food.kcalorie; 
          

        });

        this.sumKcalorie = parseInt(calcSumKcalorie);
        this.sumProtein = parseInt(calcSumProtein);
        this.sumFat = parseInt(calcSumFat);
        this.sumCarbohydrate = parseInt(calcSumCarbohydrate);
        await this.save()
        return this;
    }
  }
  Dish.init({
    name: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    sumKcalorie : DataTypes.INTEGER,
    sumProtein : DataTypes.INTEGER,
    sumFat : DataTypes.INTEGER,
    sumCarbohydrate : DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Dish',
    tableName: 'Dishes',

  });
  return Dish;
};