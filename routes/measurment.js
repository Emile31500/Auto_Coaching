const express = require('express');
const router = express.Router()
var authenticationCheckerApi = require('../middlewares/authenticationCheckerApi');
const { Measurment } = require('../models');
const premiumChecker = require('../middlewares/premiumChecker');


router.get('/api/measurment', authenticationCheckerApi, premiumChecker, async (req, res) => {

    let measurments = await Measurment.findAll({where: {userId: req.user.id}, order: [['createdAt', 'DESC']]});

    if (measurments) {

        res.statusCode = 200;
        res.send({code : res.statusCode, message : "Measurments requêtées", data: measurments});
    
    } else {

        res.statusCode = 404;
        res.send({code : res.statusCode, message: 'Aucune Measurment trouvée'});   

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
