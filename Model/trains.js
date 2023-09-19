const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const Exercise = require('./exercise.js');


const Trains = sequelize.define('Trains', {
  // Define model fields and data types
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Trains.hasMany(Exercise);
module.exports = Trains;
