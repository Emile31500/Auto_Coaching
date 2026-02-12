const express = require('express');
const {PassedSport} = require('../models/');

var adminChecker = require('../middlewares/adminChecker')


const router = express.Router()

router.get('/api/admin/train/request/:id_request/passedsport/', adminChecker, async (req, res) => {

    const idPassedsport = req.params.id_passedsport;

    let passedSport = PassedSport.findAll({where: {trainRequestId: idPassedsport}});

    if (passedSport){

        res.statusCode = 200
        res.send({'code': res.statusCode, 'message':'Passed sport has been found', 'data':passedSport});

    } else {

        res.statusCode = 404
        res.send({'code': res.statusCode, 'message':'Passed sport has not been found'});

    }
});

module.exports = router
