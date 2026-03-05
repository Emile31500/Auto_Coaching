'use strict';



const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Train extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Train.hasMany(models.ExerciseTrain, 
        {
        foreignKey: {
          name : 'trainId',
          allowNull : false
        },
      })
      Train.belongsTo(models.Program, 
        {
        foreignKey: {
          name : 'programId'
        },
      })
    }
  }
  Train.init({
    name: DataTypes.STRING,
   // description: DataTypes.CHAR,
  }, {
    sequelize,
    modelName: 'Train',
    tableName: 'trains'
  });
  return Train
};
