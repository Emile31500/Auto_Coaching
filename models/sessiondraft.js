'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SessionDraft extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SessionDraft.belongsTo(models.CurseDraft, 
        {
          foreignKey: {
            allowNull: false,
            name : 'curseDraftId'
          }
        }
      )
      SessionDraft.hasMany(models.SessionBibliographyDraft, 
        { foreignKey : 
          {
            name : 'sessionDraftId'
          }
        }
      )
      
    }
  }
  SessionDraft.init({
    curseDraftId: DataTypes.INTEGER,
    libele: DataTypes.STRING,
    videoUrl: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN,
    ordering: DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'SessionDraft',
  });
  return SessionDraft;
};