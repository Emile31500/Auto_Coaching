'use strict';
const {
  Model
} = require('sequelize');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      // define association here
    }

    async getAuthenticationToken(){

      const token = jwt.sign(
          { email: this.email },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
      )
      
      return token;

    }
  }

  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    authToken:  DataTypes.STRING,
    salt: DataTypes.STRING,
    role: DataTypes.JSON,
    sex: DataTypes.BOOLEAN,
    birthDay: DataTypes.DATEONLY,
    objectiv: DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};