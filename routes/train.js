const express = require('express');
const {TrainRequest, PassedSport, Train, User} = require('../models/');

var authenticationChecker = require('../middlewares/authenticationChecker')
var adminChecker = require('../middlewares/adminChecker')


const router = express.Router()

router.get('/train', authenticationChecker, (req, res) => {

    res.render('../views/train',  {layout: '../views/main' });

})

router.get('/api/train', authenticationChecker, async (req, res) => {

    const user = await User.findOne({where:{authToken: req.user.authToken}});
    const userId = user.id; 

    var trains = await  Train.findAll({where:{userId: userId}});

    if (trains) {

        res.statusCode = 201
        
        res.send({'code': res.statusCode, 'message': 'Trains models have been requested', 'data': trains});

    } else {

        res.statusCode = 404;
        res.send({'code':res.statusCode, 'message' : 'No train models found' + id});

    }

})

router.get('/train/request', authenticationChecker, (req, res) => {

    res.render('../views/train-request',  {layout: '../views/main' });


})

router.get('/admin/train/request', adminChecker, (req, res) => {

    res.render('../views/admin/train-request',  {layout: '../views/main-admin' });

})

router.get('/api/admin/train/request', adminChecker, async (req, res) => {

    trainRequests = await TrainRequest.findAll()

    if (trainRequests) {

        res.statusCode = 200;
        res.send({'code': res.statusCode, 'message': 'Train requests has been found', 'data': trainRequests});

    } else {

        res.statusCode = 404;
        res.send({'code': res.statusCode, 'message': 'The train request models can\'t be reached '});

    }

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