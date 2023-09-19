const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const Food = require('./food.js');

const EatFood = sequelize.define('EatFood', {});

EatFood.hasMany(Food);
module.exports = EatFood;
