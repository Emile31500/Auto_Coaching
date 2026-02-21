'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
   static associate(models) {

      Session.belongsTo(models.SessionDraft, {
        foreignKey : {
          name : 'sessionDraftId',
          allowNull : false
        }
      })
      Session.belongsTo(models.Curse, {
        foreignKey : {
          name : 'curseId',
          allowNull : false
        }
      })
    }
  }
  Session.init({
    sessionDraftId: DataTypes.INTEGER,
    libele: DataTypes.STRING,
    videoUrl: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN,
    cuserId : DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Session',
  });
  return Session;
};