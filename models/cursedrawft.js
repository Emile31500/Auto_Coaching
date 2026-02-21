'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CurseDrawft extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CurseDrawft.belongsTo(models.CurseDrawft, 
        {
          foreignKey: {
            allowNull: true,
            name : 'dependantCurseDrawftId'
          },
        }
      )
      
    }
  }
  CurseDrawft.init({
    libele: DataTypes.STRING,
    dependantCurseDrawftId: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING,
    description: DataTypes.TEXT,
    isPublished: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'CurseDrawft',
  });
  return CurseDrawft;
};