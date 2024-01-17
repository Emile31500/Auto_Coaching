const express = require('express');
const {ExerciseTrain, TrainRequest, PassedSport, Train, User, PassedInjury} = require('../models/');

var authenticationChecker = require('../middlewares/authenticationChecker')
var adminChecker = require('../middlewares/adminChecker');
const premiumChecker = require('../middlewares/premiumChecker');


const router = express.Router()

router.get('/train', authenticationChecker, premiumChecker, (req, res) => {

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

router.get('/train/request', authenticationChecker, premiumChecker, (req, res) => {

    res.render('../views/train-request',  {layout: '../views/main' });


})

router.get('/admin/train', adminChecker, (req, res) => {

    res.render('../views/admin/train',  {layout: '../views/main-admin' });

})

router.get('/admin/train/request/:id_request', adminChecker, (req, res) => {

    const idRequest = req.params.id_request;
    
    res.render('../views/admin/train-request-detail',  {layout: '../views/main-admin', id_request: idRequest});

})

router.post('/api/admin/train', adminChecker, async (req, res) => {

    const rawTrain = req.body.train;
    const rawExercisesTrains = req.body.exerciseTrains;
    let exercisesTrains = [];

    let train = await Train.create(rawTrain);

    rawExercisesTrains.forEach(async(rawExerciseTrain) => {
        
        let exerciseTrain = await ExerciseTrain.create(rawExerciseTrain)
        await train.setExerciseTrain(exerciseTrain);
        exercisesTrains.push(exerciseTrain);
    });

    if (train){

        res.statusCode = 201
        res.send({'code': res.statusCode, 'message':'Train has been created', 'data':{'train' : train, 'exerciseTrains':exercisesTrains}});

    } else {

        res.statusCode = 201
        res.send({'code': res.statusCode, 'message':'Train has been created'});

    }

});

router.get('/api/admin/train/request/:id_request', adminChecker, async (req, res) => {

    const id = req.params.id_request

    trainRequest = await TrainRequest.findOne({where: {id: id}})

    if (trainRequest){

        const passedSport = await PassedSport.findAll({where: {trainRequestId: trainRequest.id}});

        const data = JSON.stringify({trainRequest, 'passedSports' : passedSport});

        res.statusCode = 200;
        res.send({'code': res.statusCode, 'message': 'Train request has been found', 'data': data});

    } else {

        res.statusCode = 404;
        res.send({'code': res.statusCode, 'message': 'The train request model can\'t be reached '});

    }
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

    const rawDataTrainRequest = req.body.trainRequest;
    const rawDataPassedSport = req.body.passedSport;
    const rawDataPassedInjs = req.body.passedInj;

    var trainRequest = await TrainRequest.create(rawDataTrainRequest);


    createAssociation(rawDataPassedSport, PassedSport)
    createAssociation(rawDataPassedInjs, PassedInjury)

    async function createAssociation(array, model){

        if (array.length > 0){

            var index = 0;
            var jsonArray = []
            
            await Promise.all(array.map(async (row) => {
    
                jsonArray[index] = await model.create(row);
                jsonArray[index].userId = userId;

                await jsonArray[index].setTrainRequest(trainRequest);
                await jsonArray[index].save();
                index++;

            }));    

            return jsonArray;
        }
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