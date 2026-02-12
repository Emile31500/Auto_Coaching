'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Message.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'sender' });
      Message.belongsTo(models.User, { foreignKey: 'userIdRecipient', targetKey: 'id', as : 'recipient' });

    }
  }
  Message.init({
    isDelated: DataTypes.BOOLEAN,
    isViewed: DataTypes.BOOLEAN,
    message: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',

  });
  return Message;
};