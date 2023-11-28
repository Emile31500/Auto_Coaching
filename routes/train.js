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

    const trainRequest = TrainRequest.create({userId: userId}, req.body);

    if (req.body.passedSport.length > 0){

        var index = 0;
        req.body.passedSport.forEach(row => {

            let tempPS = PassedSport.create(JSON.parse(row));
            passedSports.push(tempPS);
            index++;

        });
    }

    if (trainRequest) {

        res.statusCode = 201
        
        res.send({'code': 201,'message': 'Train request has been created' ,'data': req.body});

    } else {

        res.statusCode = 404;
        res.send({'message' : 'This food was not found of id ' + id});

    }

})

 module.exports = router