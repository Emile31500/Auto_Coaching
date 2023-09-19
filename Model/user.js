const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const Trains = require('./trains.js');

const User = sequelize.define('User', {
  // Define model fields and data types
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
User.hasOne(Trains);

module.exports = User;
