const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const Food = sequelize.define('Food', {
  // Define model fields and data types
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  carbohydrate: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  proteine: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fat: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  trans_fat: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_meat: {
    type: DataTypes.BOOL,
    allowNull: false
  },
  is_milk: {
    type: DataTypes.BOOL,
    allowNull: false
  },
  is_egg: {
    type: DataTypes.BOOL,
    allowNull: false
  },
  is_veggie: {
    type: DataTypes.BOOL,
    allowNull: false
  }
});

module.exports = Food;
