'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SessionBibliographyDraft extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SessionBibliographyDraft.belongsTo(models.SessionDraft, 
        {
        foreignKey: {
          name : 'sessionDraftId'
        },
      })
    }
  }
  SessionBibliographyDraft.init({
    sessionDraftId: DataTypes.INTEGER,
    url: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'SessionBibliographyDraft',
  });
  return SessionBibliographyDraft;
};