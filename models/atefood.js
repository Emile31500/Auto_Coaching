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
      AteFood.belongsTo(models.User, 
        {
          foreignKey: {
            allowNull: false,
            name : 'userId'
          },
        }
      )
      AteFood.belongsTo(models.Food, 
          {
          foreignKey: {
            allowNull: false,
            name : 'foodId'
          },
        }
      )
    }
  }
  AteFood.init({
    weight: DataTypes.INTEGER,
    date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'AteFood',
    tableName: 'atefoods'
  });
  return AteFood;
};