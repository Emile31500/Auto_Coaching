const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const Exercise = sequelize.define('Exercise', {
  // Define model fields and data types
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Exercise;
