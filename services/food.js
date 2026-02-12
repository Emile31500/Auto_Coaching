const { Food } = require('../models');
const { Op } = require('sequelize');


const getForMainPage = async (parsedUrlQuery, user) => {

    const orderParameter = parsedUrlQuery.orderParameter ?? 'name';
    const orderBy = parsedUrlQuery.orderBy ?? "ASC";
    const kcalFilterMin = parsedUrlQuery.kcalFilterMin ?? 0;
    const proteinFilterMin = parsedUrlQuery.proteinFilterMin ?? 0;
    const fatFilterMin = parsedUrlQuery.fatFilterMin ?? 0;
    const carboFilterMin = parsedUrlQuery.carboFilterMin ?? 0;
    const words = parsedUrlQuery.words ?? '';
    const arrayWords = words.split(" ");
    let nameSelector = []

    arrayWords.forEach(word => {
        nameSelector.push({[Op.like] : '%'+word+'%'});
    });

    let fatFilterMax;
    let proteinFilterMax;
    let carboFilterMax;
    let kcalFilterMax;

    if (parsedUrlQuery.kcalFilterMax > 0) {
        kcalFilterMax = parsedUrlQuery.kcalFilterMax 
    } else {
        maxKcalFood = await Food.findOne({order: [['kcalorie', 'DESC']]})
        kcalFilterMax = maxKcalFood.kcalorie;
    }

    if (parsedUrlQuery.proteinFilterMax > 0) {
        proteinFilterMax = parsedUrlQuery.proteinFilterMax 
    } else {
        maxProteinFood = await Food.findOne({order: [['proteine', 'DESC']]})
        proteinFilterMax = maxProteinFood.proteine;
    }

    if (parsedUrlQuery.fatFilterMax > 0) {
        fatFilterMax = parsedUrlQuery.fatFilterMax 
    } else {
        maxFatFood = await Food.findOne({order: [['fat', 'DESC']]})
        fatFilterMax = maxFatFood.kcalorie;
    }

    if (parsedUrlQuery.carboFilterMax > 0) {
        carboFilterMax = parsedUrlQuery.carboFilterMax 
    } else {
        maxCarboFood = await Food.findOne({order: [['carbohydrate', 'DESC']]})
        carboFilterMax = maxCarboFood.carbohydrate;
    }

    let where = ({
        kcalorie : {[Op.between] : [kcalFilterMin, kcalFilterMax]},
        proteine : {[Op.between] : [proteinFilterMin, proteinFilterMax]},
        fat : {[Op.between] : [fatFilterMin, fatFilterMax]},
        carbohydrate : {[Op.between] : [carboFilterMin, carboFilterMax]},
        name : { 
            [Op.or] : nameSelector
        },
        userId : {[Op.or] : [ user.id, null]}
    });

    if(user.role.includes('admin') == true) delete where.userId;

    let food = await Food.findAll({
        order: [[orderParameter, orderBy]],
        where : where
    }); 

    return food;
};

const countFilters = async (parsedUrlQuery) => {
    count = 0;
    Object.values(parsedUrlQuery).forEach(element => {if (element !== undefined && element !== '') count++;});
    return count;
}

module.exports = {
  getForMainPage,
  countFilters,
};