const express = require('express');
const router = express.Router()
var authenticationCheckerApi = require('../middlewares/authenticationCheckerApi');
const { User, Measurment } = require('../models');
const premiumChecker = require('../middlewares/premiumChecker');


router.get('/api/measurment', authenticationCheckerApi, premiumChecker, async (req, res) => {

    let measurments = await Measurment.findAll({where: {userId: req.user.id}, order: [['createdAt', 'DESC']]});

    if (measurments) {

        res.code = 200;
        res.send({"code":200, "message":"Measurments requêtées", "data": measurments});
    
    } else {

        res.code = 404;
        res.send({'code': 404, 'message': 'Aucune Measurment trouvée'});   

    }


});

router.post('/api/measurment', authenticationCheckerApi, premiumChecker, async (req, res) => {

    let data  = req.body;

    if (data){

        data.userId = req.user.id;

        let measurment = await Measurment.create(data);

        if (measurment) {

            res.code = 201
            res.send({"code" : 201, "message": "Les Measurments ont bien étées ajoutées.", "data": measurment});


        } else {

            res.code = 400
            res.send({"code" : 400, "message": "L'utilisateur n'a pas put être créé."});

        }

    };

});

module.exports = router
