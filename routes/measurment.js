const express = require('express');
const router = express.Router()
var authenticationCheckerApi = require('../middlewares/authenticationCheckerApi');
var authenticationChecker = require('../middlewares/authenticationChecker')
var parserJson = require('../middlewares/parserJson');
const { Measurment } = require('../models');
const premiumChecker = require('../middlewares/premiumChecker');
const FoodService = require('../services/food');

router.post('/measurment', parserJson, authenticationChecker, premiumChecker, async (req, res) => {

    try {

        if (req.body && req.session.token){

            const rawData = req.body 

            const measurment = await Measurment.create({
                size : rawData.size,
                weight : rawData.weight,
                userId : req.user.id
            });
            
            FoodService.recalculateMacroBelongWithLastMeasurment(measurment);
            measurment.userId = req.user.id;

            req.flash('success', 'Votre nouvelle progression a bien été créé');
        
        } else {

            throw ('soumission du formulaire non valide')

        }

    } catch (error) {

        req.flash('danger', error);

    }

    res.redirect('/profile')
});

router.get('/api/measurment', authenticationCheckerApi, premiumChecker, async (req, res) => {

    try {
        
        let measurments = await Measurment.findAll({where: {userId: req.user.id}, order: [['createdAt', 'ASC']]});

        if (measurments) {

            res.statusCode = 200;
            res.send({code : res.statusCode, message : "Measurments requêtées", data: measurments});
        
        } else throw 'Aucune Measurment trouvée';

    } catch (error) {
        res.statusCode = 404;
        res.send({code : res.statusCode, message: error });   
    }


});

router.post('/api/measurment', authenticationCheckerApi, premiumChecker, async (req, res) => {

    let data  = req.body;

    if (data){

        data.userId = req.user.id;

        const measurment = await Measurment.create(data);

        if (measurment) {

            res.statusCode = 201
            res.send({code : res.statusCode, message :  "Les Measurments ont bien étées ajoutées.", data: measurment});


        } else {

            res.statusCode = 400
            res.send({code : res.statusCode, message :  "L'utilisateur n'a pas put être créé."});

        }

    };

});

module.exports = router
