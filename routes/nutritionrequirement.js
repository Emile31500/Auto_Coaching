const express = require('express');
const router = express.Router()
const { NutritionRequirement } = require('../models');
const parserJson = require('../middlewares/parserJson');
const authenticationChecker = require('../middlewares/authenticationChecker');
const { Op } = require('sequelize')

router.post('/nutritionrequirement', authenticationChecker, parserJson, async (req, res) => {

    try {

        const id = req.user.id
        const rawData = req.body;

        await req.user.update({
            objectiv : rawData.objectiv
        });
        let kcalorie, protein, fat;
        if (rawData.objectiv == "1") protein *= 1.8;
        if (rawData.objectiv != "1") protein *= 2.2;
        
        const age = calculateAge(req.user.birthDay)


        if (rawData.sexe == "1") {
            kcalorie = 88.4 + (14 * rawData.weight) + (4.8 * rawData.size) - (5.7 * age);
        } else {
            kcalorie = 447.6 + (9.3 * rawData.weight) + (3.1 * rawData.size) - (4.4 * age);
        }

        if (rawData.wantToTrain === "true"){
            kcalorie += (1.5*400/7)
        } else {
            protein *= 0.7
            fat *= 0.9
        }

        const slowKcalorieBurningActivitesMultiplicator = calculateMultiplicatorOfNormalActivite(
            rawData.wantToTrain === "true",
            rawData.crafts,
            rawData.step,
            rawData
        );

        kcalorie *= slowKcalorieBurningActivitesMultiplicator;
        kcalorie += (rawData.step / 10000 * 496 * rawData.weight/70);
        kcalorie += rawData.crafts/60 / 510 * rawData.weight/70/7;

        const nutritionRequirement = await NutritionRequirement.create({
            kcalorie : parseInt(kcalorie),
            metabolismMultiplicator : rawData.metabolismMultiplicator,
            proteine : parseInt(protein),
            fat : parseInt(fat),
            personnalMultiplicator : 1.0,
            proteinMultiplicator : 1.0,
            fatMultiplicator : 1.0,
            userId : id
        })


        req.flash('success', 'Vos besoin nutritionnel ont bien été calculé. Vous pourves maintenant gérer votre diète. Notez qu\'ils sont amené à être cahnger automatiquement par l\' application selon vos résultat')
        const toDay = new Date()
        res.redirect('/nutrition/' + toDay.getFullYear() + "-" + (toDay.getMonth()+1) + "-" + toDay.getDate());

    } catch (error){

        console.log(error)
        req.flash('danger', error.message)
        res.redirect('/profile/objectif')
        
    }
});

function calculateAge(birthDay) {

    const birthDate = new Date(birthDay+'T00:00:00');
    const currentDate = new Date();

    age = currentDate.getFullYear() - birthDate.getFullYear();
    const hasBirthdayOccurred = (currentDate.getMonth() > birthDate.getMonth() ||(currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate()));

    if (hasBirthdayOccurred) age -= 1;

    const intAge = age;
    return intAge;
}

function calculateMultiplicatorOfNormalActivite(doSport, craft, setp, rawMeasurment) {

    let ttlSlowKcalorieBurningActivites = 7 * 16;
    const ttlHouseAwakeWeekly = 7 * 16;
    const setpByHoursEstimated = ((8/5)*1000) * rawMeasurment.size/1.8;
    const hoursMArching = (setp / setpByHoursEstimated)*7

    ttlSlowKcalorieBurningActivites -= (craft/60)
    ttlSlowKcalorieBurningActivites -= hoursMArching
    if (doSport) ttlSlowKcalorieBurningActivites -= 1.5; 


    const slowKcalorieBurningActivitesMultiplicator = 1 + (0.3 * (ttlSlowKcalorieBurningActivites / ttlHouseAwakeWeekly))
    return slowKcalorieBurningActivitesMultiplicator;
}


module.exports = router
