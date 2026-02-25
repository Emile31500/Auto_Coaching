'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Curse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Curse.belongsTo(models.CurseDraft, 
        {
          foreignKey: {
            allowNull: false,
            name : 'curseDraftId'
          },
        }
      )
      Curse.belongsTo(models.Curse, 
          {
          foreignKey: {
            allowNull: true,
            name : 'dependantCurseId'
          },
        }
      )//,
      Curse.hasMany(models.Session, { name : 'curseId' })
      Curse.hasMany(models.ViewedCurse,{
         foreignKey : {
          name : 'curseId',
          allowNull : false
        }
      })

    }
  }

  Curse.init({
    libele: DataTypes.STRING,
    dependantCurseId: DataTypes.INTEGER,
    curseDraftId: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING,
    description: DataTypes.TEXT,
    isPublished: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Curse',
  });
  return Curse;
};