'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DishFood extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       DishFood.belongsTo(models.Food, 
        {
          foreignKey: {
            allowNull: false,
            name : 'foodId'
          },
        }
      )
      DishFood.belongsTo(models.Dish, 
        {
          foreignKey: {
            allowNull: false,
            name : 'dishId'
          },
        }
      )
    }
  }
  DishFood.init({
    weight: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DishFood',
  });
  return DishFood;
};