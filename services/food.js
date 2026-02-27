const { Dish, DishFood, Food, Measurment, NutritionRequirement } = require('../models');
const { fn, Op, col } = require('sequelize');

async function getAllFitlerParameters (parsedUrlQuery) {

    const orderParameter = parsedUrlQuery.orderParameter ?? 'name';
    const orderBy = parsedUrlQuery.orderBy ?? "ASC";
    const kcalFilterMin = parsedUrlQuery.kcalFilterMin ?? 0;
    const proteinFilterMin = parsedUrlQuery.proteinFilterMin ?? 0;
    const fatFilterMin = parsedUrlQuery.fatFilterMin ?? 0;
    const carboFilterMin = parsedUrlQuery.carboFilterMin ?? 0;
    const words = parsedUrlQuery.words ?? '';
    const arrayWords = words.split(" ");
    let nameSelector = []
    let kcalFilterMax, proteinFilterMax, fatFilterMax, carboFilterMax;

    arrayWords.forEach(word => {
        nameSelector.push({[Op.like] : '%'+word+'%'});
    });

   if (parsedUrlQuery.kcalFilterMax > 0) {
        kcalFilterMax = parsedUrlQuery.kcalFilterMax 
    } else {
        kcalFilterMax = await Dish.max('sumKcalorie')
        const maxKcalFood = await Food.max('kcalorie')
        if (maxKcalFood > kcalFilterMax) kcalFilterMax = maxKcalFood;
    }

   if (parsedUrlQuery.fatFilterMax > 0) {
        fatFilterMax = parsedUrlQuery.fatFilterMax 
    } else {
        fatFilterMax = await Dish.max('sumFat')
        const maxFatFood = await Food.max('fat')
        if (maxFatFood > fatFilterMax) fatFilterMax = maxFatFood;
    }

    if (parsedUrlQuery.proteinFilterMax > 0) {
        proteinFilterMax = parsedUrlQuery.proteinFilterMax 
    } else {
        proteinFilterMax = await Dish.max('sumProtein')
        const maxProteinFood = await Food.max('proteine')
        if (maxProteinFood > proteinFilterMax) proteinFilterMax = maxProteinFood;
    }

    if (parsedUrlQuery.carboFilterMax > 0) {
        carboFilterMax = parsedUrlQuery.carboFilterMax 
    } else {
        carboFilterMax = await Dish.max('sumCarbohydrate')
        const maxCarboFood = await Food.max('carbohydrate')
        if (maxCarboFood > carboFilterMax) carboFilterMax = maxCarboFood;
    }

    const result = {
        orderParameter : orderParameter,
        orderBy : orderBy,
        kcalFilterMin : parseInt(kcalFilterMin) || 0,
        proteinFilterMin : parseInt(proteinFilterMin) || 0,
        fatFilterMin : parseInt(fatFilterMin) || 0,
        carboFilterMin : parseInt(carboFilterMin) || 0,
        nameSelector : nameSelector,
        kcalFilterMax : parseInt(kcalFilterMax),
        proteinFilterMax : parseInt(proteinFilterMax),
        fatFilterMax : parseInt(fatFilterMax),
        carboFilterMax : parseInt(carboFilterMax)
    };

    return result;

}


const getFoodsForMainPage = async (parsedUrlQuery, user) => {

    const Filters = await getAllFitlerParameters(parsedUrlQuery);

    const where = ({
        kcalorie : {[Op.between] : [Filters.kcalFilterMin, Filters.kcalFilterMax]},
        proteine : {[Op.between] : [Filters.proteinFilterMin, Filters.proteinFilterMax]},
        fat : {[Op.between] : [Filters.fatFilterMin, Filters.fatFilterMax]},
        carbohydrate : {[Op.between] : [Filters.carboFilterMin, Filters.carboFilterMax]},
        name : { 
            [Op.or] : Filters.nameSelector
        },
        userId : {[Op.or] : [ user.id, null]}
    });

    console.log(where);
    if(user.role.includes('admin') == true) delete where.userId;
    console.log(where);

    let food = await Food.findAll({
        order: [[Filters.orderParameter, Filters.orderBy]],
        where : where
    }); 

    return food;
};

const getDishesForMainPage = async (parsedUrlQuery, user) => {

    const Filters = await getAllFitlerParameters(parsedUrlQuery)

    const where = ({
        sumKcalorie : {[Op.between] : [Filters.kcalFilterMin, Filters.kcalFilterMax]},
        sumProtein : {[Op.between] : [Filters.proteinFilterMin, Filters.proteinFilterMax]},
        sumFat : {[Op.between] : [Filters.fatFilterMin, Filters.fatFilterMax]},
        sumCarbohydrate : {[Op.between] : [Filters.carboFilterMin, Filters.carboFilterMax]},
        /*name : { 
            [Op.or] : Filters.nameSelector
        },*/
        userId : {[Op.or] : [ user.id, null]}
    });

    console.log(where);
    if(user.role.includes('admin') == true) delete where.userId;
    console.log(where);

    let dish = await Dish.findAll({ 
        include : [{
            model : DishFood,
            include : [
                Food
            ]
        }],
        order: [[Filters.orderParameter, Filters.orderBy]],
        where : where
    }); 

    return dish;
};


const recalculateMacroBelongWithLastMeasurment = async (measurment) => {

    const origininalDate = new Date(measurment.createdAt);
    const startDay = origininalDate;
    startDay.setDate(startDay.getDate() - 6);

    const endDay = origininalDate;
    endDay.setDate(endDay.getDate() - 15);

    const lastButOneMeasurment = await Measurment.findOne({
        createdAt :{
            [Op.between] : [startDay, endDay]},
        userId : measurment.userId
    })

    const nutritionrequirement = await NutritionRequirement.findOne({
        userId : measurment.userId
    })

    const delta = measurment.weight - lastButOneMeasurment.weight

    if (user.objectiv == 2 ) {

        if (lastButOneMeasurment instanceof Measurment) {

            if (delta < -0.6) {

                await nutritionrequirement.update({
                    personnalMultiplicator : nutritionrequirement.personnalMultiplicator+0.03,
                    proteinMultiplicator : nutritionrequirement.proteinMultiplicator+0.03,
                    fatMultiplicator : nutritionrequirement.fatMultiplicator+0.01,
                })

            } else if (delta > 0) {

                await nutritionrequirement.update({
                    personnalMultiplicator : nutritionrequirement.personnalMultiplicator-0.05,
                })

            }
        }

    } else {

        if (lastButOneMeasurment instanceof Measurment) {

            if (delta < 0) {

                await nutritionrequirement.update({
                    personnalMultiplicator : nutritionrequirement.personnalMultiplicator+0.03,
                    proteinMultiplicator : nutritionrequirement.proteinMultiplicator+0.03,
                    fatMultiplicator : nutritionrequirement.fatMultiplicator+0.01,
                })

            } else if (delta > 0) {

                await nutritionrequirement.update({
                    personnalMultiplicator : nutritionrequirement.personnalMultiplicator-0.05,
                    proteinMultiplicator : nutritionrequirement.proteinMultiplicator-0.03,
                    fatMultiplicator : nutritionrequirement.fatMultiplicator-0.01,
                })

            }
        }

    }
        
}

const countFilters = async (parsedUrlQuery) => {
    count = 0;
    Object.values(parsedUrlQuery).forEach(element => {if (element !== undefined && element !== '') count++;});
    return count;
}

module.exports = {
    recalculateMacroBelongWithLastMeasurment,
    getFoodsForMainPage,
    getDishesForMainPage,
    countFilters,
};