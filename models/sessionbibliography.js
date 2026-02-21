'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SessionBibliography extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SessionBibliography.belongsTo(models.SessionBibliographyDraft, 
        {
        foreignKey: {
          name : 'sessionBibliographyDraftId'
        },
      })
      SessionBibliography.belongsTo(models.Session, 
        {
        foreignKey: {
          name : 'sessionId'
        },
      })
    }
  }
  SessionBibliography.init({
    libele: DataTypes.STRING,
    sessionBibliographyDraftId: DataTypes.INTEGER,
    sessionId: DataTypes.INTEGER,
    videoUrl: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'SessionBibliography',
  });
  return SessionBibliography;
};