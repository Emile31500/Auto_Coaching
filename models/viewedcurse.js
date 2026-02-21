'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ViewedCurse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    
    }
  }
  ViewedCurse.init({
    userId: DataTypes.INTEGER,
    curseId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ViewedCurse',
  });
  return ViewedCurse;
};