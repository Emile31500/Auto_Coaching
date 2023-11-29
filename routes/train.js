const express = require('express');
const {TrainRequest, PassedSport, User} = require('../models/');

var authenticationChecker = require('../middlewares/authenticationChecker')

const router = express.Router()

router.get('/train', authenticationChecker, (req, res) => {

    res.render('../views/train',  {layout: '../views/main' });


})

router.get('/train/request', authenticationChecker, (req, res) => {

    res.render('../views/train-request',  {layout: '../views/main' });


})

router.post('/api/train/request', authenticationChecker, async (req, res) => {

    var user = await User.findOne({where: {authToken:  req.session.token}});
    const userId = user.id;
    var passedSports = []; 
    
    const rawDataTrainRequest = req.body.trainRequest;
    const rawDataPassedSport = req.body.passedSport;

    var trainRequest = await TrainRequest.create(rawDataTrainRequest);

    if (rawDataPassedSport.length > 0){

        var index = 0;
        rawDataPassedSport.forEach(async (row) => {

            let passedSport = await PassedSport.create(JSON.parse(row));
            passedSport.userId = userId;
            await trainRequest.addPassedSport(passedSport);
            passedSports.push(passedSport);
            index++;

        });
    }

    if (trainRequest) {

        res.statusCode = 201
        
        res.send({'code': res.statusCode, 'message': 'Train request has been created', 'data': req.body});

    } else {

        res.statusCode = 404;
        res.send({'code':res.statusCode, 'message' : 'This food was not found of id ' + id});

    }

})

 module.exports = router