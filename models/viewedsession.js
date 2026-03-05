'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ViewedSession extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ViewedSession.belongsTo(models.Session, {
        foreignKey : {
          name : 'sessionId',
          allowNull : false
        }
      })
    }
  }
  
  ViewedSession.init({
    userId: DataTypes.INTEGER,
    sessionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ViewedSession',
  });
  return ViewedSession;
};