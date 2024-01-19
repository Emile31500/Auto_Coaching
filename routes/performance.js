const express = require('express');
const router = express.Router()
var authenticationChecker = require('../middlewares/authenticationChecker');
const { User, Performance } = require('../models');
const premiumChecker = require('../middlewares/premiumChecker');


router.get('/api/performance', authenticationChecker, premiumChecker, async (req, res) => {

    const userId = req.user.id;

    let performances = await Performance.findAll({where: {userId: userId}, order: [['createdAt', 'DESC']]});

    if (performances) {

        res.code = 200;
        res.send({"code":200, "message":"Performances requêtées", "data": performances});
    
    } else {

        res.code = 404;
        res.send({'code': 404, 'message': 'Aucune performance trouvée'});   

    }


});

router.post('/api/performance', authenticationChecker, premiumChecker, async (req, res) => {

    let data  = req.body;

    if (data){

        data.userId = req.user.id;

        let performance = Performance.create(data);

        if (performance) {

            res.code = 201
            res.send({"code" : 201, "message": "Les performances ont bien étées ajoutées.", "data": performance});


        } else {

            res.code = 400
            res.send({"code" : 400, "message": "L'utilisateur n'a pas put être créé."});

        }

    };

});

module.exports = router
