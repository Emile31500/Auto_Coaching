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

      const authToken = jwt.sign({ __id: this.id }, process.env.JWT_SECRET);
      this.authToken = authToken;
      await this.save();
      return authToken;

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