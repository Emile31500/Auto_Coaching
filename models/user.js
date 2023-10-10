'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    /*static async authJWT(){

      const authToken = jwt.sign({ __id: this.id }, 'privateKey');
      this.authToken = authToken;
      await this.save();
      return authToken;

    }*/

  }

  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    authToken:  DataTypes.STRING,
    salt: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};