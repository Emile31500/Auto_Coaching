'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TrainRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TrainRequest.init({
    userId: DataTypes.INTEGER,
    objectif: {
      type : DataTypes.STRING,
      validate : {
        len: [0, 32]
      }
    },
    height: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    metabolism: {
      type : DataTypes.STRING,
      validate: {
        len: [0, 32]
      }},
    description:{ type : DataTypes.STRING,
      validate : {
        len: [0, 16384]
      }}
  }, {
    sequelize,
    modelName: 'TrainRequest',
  });
  return TrainRequest;
};