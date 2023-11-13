const express = require('express');
const router = express.Router()
var authenticationChecker = require('../middlewares/authenticationChecker');
const { User, Measurment } = require('../models');


router.get('/api/measurment', authenticationChecker, async (req, res) => {

    const user = await User.findOne({where: {authToken:  req.session.token}});
    const userId = user.id;

    let measurments = await Measurment.findAll({where: {userId: userId}, order: [['createdAt', 'DESC']]});

    if (measurments) {

        res.code = 200;
        res.send({"code":200, "message":"Measurments requêtées", "data": measurments});
    
    } else {

        res.code = 404;
        res.send({'code': 404, 'message': 'Aucune Measurment trouvée'});   

    }


});

router.post('/api/measurment', authenticationChecker, async (req, res) => {

    let data  = req.body;

    if (data){

        var user = await User.findOne({where: {authToken:  req.session.token}});
        data.userId = user.id;

        let measurment = Measurment.create(data);

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
