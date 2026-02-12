const express = require('express');
const router = express.Router()
var authenticationCheckerApi = require('../middlewares/authenticationCheckerApi');
const { Performance } = require('../models');
const premiumChecker = require('../middlewares/premiumChecker');


router.get('/api/performance', authenticationCheckerApi, premiumChecker, async (req, res) => {

    const userId = req.user.id;

    let performances = await Performance.findAll({where: {userId: userId}, order: [['createdAt', 'DESC']]});

    if (performances) {

        res.statusCode = 200;
        res.send({code : res.statusCode, message: "Performances requêtées", data: performances});
    
    } else {

        res.statusCode = 404;
        res.send({code : res.statusCode, message: 'Aucune performance trouvée'});   

    }


});

router.post('/api/performance', authenticationCheckerApi, premiumChecker, async (req, res) => {

    let data  = req.body;

    if (data){

        data.userId = req.user.id;

        let performance = await Performance.create(data);

        if (performance) {

            res.statusCode = 201
            res.send({code : res.statusCode, message: "Les performances ont bien étées ajoutées.", data: performance});


        } else {

            res.statusCode = 400
            res.send({code : res.statusCode, message: "L'utilisateur n'a pas put être créé."});

        }

    };

});

module.exports = router
