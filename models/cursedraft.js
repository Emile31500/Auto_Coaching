'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CurseDraft extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      /*CurseDraft.belongsTo(models.CurseDraft, 
        {
          foreignKey: {
            allowNull: true,
            name : 'dependantCurseDraftId'
          },
        }
      )*/
      CurseDraft.hasMany(models.SessionDraft, {
          foreignKey: 'curseDraftId'
      })
      
    }
  }
  CurseDraft.init({
    libele: DataTypes.STRING,
    // dependantCurseDraftId: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING,
    description: DataTypes.TEXT,
    isPublished: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'CurseDraft',
  });
  return CurseDraft;
};