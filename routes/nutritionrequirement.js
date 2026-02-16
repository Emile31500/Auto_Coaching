const express = require('express');
const router = express.Router()
const { NutritionRequirement, Measurment } = require('../models');
const parserJson = require('../middlewares/parserJson');
const authenticationChecker = require('../middlewares/authenticationChecker');
const { Op } = require('sequelize')

router.post('/nutritionrequirement', authenticationChecker, parserJson, async (req, res) => {

    const id = req.user.id
    try {

        const rawData = req.body;

        await req.user.update({
            objectiv : rawData.objectiv
        });

        const measurment = await Measurment.findOne({
            where : {
                userId : id,
                size: { [Op.gt]: 0 },
                weight: { [Op.gt]: 0 },

            },
            order: [
                ['createdAt', 'DESC']
            ]
        })
        weight;
        size;

        if (rawData.size && rawData.weight) {

            weight = rawData.weight;
            size = rawData.size;

            if (measurment instanceof Measurment) {

                const createMeasurment = await Measurment.create({
                    size : size,
                    weight : weight,
                    userId : req.user.id
                })
            } else {
                throw 'Vous n\'avez pas renseigner votre poids et/ou votre taille et aucune données n\'a pu être trouvé dans l\'onglet "mensurations"';
            }

        }  else if (measurment instanceof Measurment) {

            weight = measurment.weight;
            size = measurment.size;
        
        } else {

            throw 'Vous n\'avez pas renseigner votre poids et/ou votre taille et aucune données n\'a pu être trouvé dans l\'onglet "mensurations"';
        
        }
        

        fat = measurment.weight;
        protein = measurment.weight;
        if (rawData.objectiv == "1") protein *= 1.8;
        if (rawData.objectiv != "1") protein *= 2.2;
        
        const age = calculateAge(req.user.birthDay)


        if (rawData.sexe) {
            kcalorie = 88.4 + (14 * measurment.weight) + (4.8 * measurment.size) - (5.7 * age);
        } else {
            kcalorie = 447.6 + (9.3 * measurment.weight) + (3.1 * measurment.size) - (4.4 * age);
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
            measurment
        );

        kcalorie *= slowKcalorieBurningActivitesMultiplicator;
        kcalorie += (rawData.step / 10000 * 496 * measurment.weight/70);
        kcalorie += rawData.crafts/60 / 510 * measurment.weight/70/7;

        const nutritionRequirement = await NutritionRequirement.update({
            kcalorie : parseInt(kcalorie),
            metabolismMultiplicator : rawData.metabolismMultiplicator,
            proteine : parseInt(protein),
            fat : parseInt(fat),
        },{
            where : {
                userId : id
            }
        })


        req.flash('success', 'Vos besoin nutritionnel ont bien été calculé. Vous pourves maintenant gérer votre diète. Notez qu\'ils sont amené à être cahnger automatiquement par l\' application selon vos résultat')
        const toDay = new Date()
        res.redirect('/nutrition/' + toDay.getFullYear() + "-" + (toDay.getMonth()+1) + "-" + toDay.getDate());

    } catch (error){

        req.flash('danger', error)
        res.redirect('/profile')
        
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

function calculateMultiplicatorOfNormalActivite(doSport, craft, setp, measurment) {

    let ttlSlowKcalorieBurningActivites = 7 * 16;
    const ttlHouseAwakeWeekly = 7 * 16;
    const setpByHoursEstimated = ((8/5)*1000) * measurment.size/1.8;
    const hoursMArching = (setp / setpByHoursEstimated)*7

    ttlSlowKcalorieBurningActivites -= (craft/60)
    ttlSlowKcalorieBurningActivites -= hoursMArching
    if (doSport) ttlSlowKcalorieBurningActivites -= 1.5; 


    const slowKcalorieBurningActivitesMultiplicator = 1 + (0.3 * (ttlSlowKcalorieBurningActivites / ttlHouseAwakeWeekly))
    return slowKcalorieBurningActivitesMultiplicator;
}


module.exports = router
