'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NutritionRequirement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
      static associate(models) {
        NutritionRequirement.belongsTo(models.User, {
          foreignKey : 'userId'
        })
      }

      calculateAge(birth_day) {

        const birthDate = new Date(birth_day);

        const currentDate = new Date();
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        const hasBirthdayOccurred = (
            currentDate.getMonth() > birthDate.getMonth() ||
            (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate()) ||
            (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() === birthDate.getDate() && currentDate.getHours() >= birthDate.getHours()) ||
            (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() === birthDate.getDate() && currentDate.getHours() === birthDate.getHours() && currentDate.getMinutes() >= birthDate.getMinutes()) ||
            (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() === birthDate.getDate() && currentDate.getHours() === birthDate.getHours() && currentDate.getMinutes() === birthDate.getMinutes() && currentDate.getSeconds() >= birthDate.getSeconds())
        );

        if (hasBirthdayOccurred) {

            age = age - 1;
            
        }

        const intAge = age;
        return intAge;
    }
    generateDefaultNutrient(rawDataTrainRequest, homme) {

      let wantToGainWeight = false

      if (rawDataTrainRequest.objectif.toLowerCase().include('volume') || rawDataTrainRequest.objectif.toLowerCase().include('force')) {

        wantToGainWeight = true;

      }

      let age = this.calculateAge(rawDataTrainRequest.birthDay)
      this.fat = rawDataTrainRequest.weight
        
      if (homme) {

        this.kcalorie = 88.4 + (14 * rawDataTrainRequest.weight) + (4.8 * rawDataTrainRequest.height) - (5.7 * age);

      } else {

        this.kcalorie = 447.6 + (9.3 * rawDataTrainRequest.weight) + (3.1 * rawDataTrainRequest.height) - (4.4 * age);

      }

      if (wantToGainWeight) {

        this.proteine = rawDataTrainRequest.weight * 2

      } else {

        this.proteine = rawDataTrainRequest.weight * 2.2

      }
    }
  }

  NutritionRequirement.init({
    metabolismMultiplicator: DataTypes.FLOAT,
    personnalMultiplicator: DataTypes.FLOAT,
    proteinMultiplicator: DataTypes.FLOAT,
    fatMultiplicator: DataTypes.FLOAT,
    kcalorie: DataTypes.INTEGER,
    proteine: DataTypes.INTEGER,
    fat: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'NutritionRequirement',
    tableName: 'nutritionrequirements'
  });
  return NutritionRequirement;
};