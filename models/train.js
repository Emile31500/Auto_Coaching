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
      Train.belongsTo(models.TrainRequest)
      models.TrainRequest.hasOne(Train);
    }

    async getDays() {

      const { ExerciseTrain } = require('./')

      const days = await ExerciseTrain.findAll({
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('day')), 'day'] 
        ],
        group: ['day'],
        where : {id: this.id} // Group by the specified column
      })

      return days;

    }
  }
  Train.init({
    name: DataTypes.STRING,
    isFinished: DataTypes.BOOLEAN,
    trainRequestId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Train',
    tableName: 'trains'
  });
  return Train
};




