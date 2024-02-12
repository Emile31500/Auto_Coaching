const express = require('express');
const { Exercise, ExerciseTrain, TrainRequest, PassedSport, Train, PassedInjury} = require('../models/');
const router = express.Router();
var authenticationChecker = require('../middlewares/authenticationChecker')
var authenticationCheckerApi = require('../middlewares/authenticationCheckerApi')
var adminChecker = require('../middlewares/adminChecker');
var adminCheckerApi = require('../middlewares/adminCheckerApi');
const premiumChecker = require('../middlewares/premiumChecker');


router.get('/train', authenticationChecker, premiumChecker, (req, res) => {

    res.render('../views/train',  {layout: '../views/main' });

})

router.get('/train/:id_train', authenticationChecker, premiumChecker, async (req, res) => {

    const userId = req.user.id; 
    const trainId = req.params.id_train

    const train = await Train.findOne({where : {
            id : trainId,
            isFinished : true,  
            userId : userId
        }, 
        orderBy : [['day', 'ASC']]
    });


    const exerciseTrain = await ExerciseTrain.findAll({where : {
            trainId : trainId
        }
    });

    if (train && exerciseTrain) {

        let jsonRes = train;
        
        jsonRes.exerciseTrain = exerciseTrain;
        
        for (let i = 0; i <jsonRes.exerciseTrain.length; i++) {

            jsonRes.exerciseTrain[i].exercise = await Exercise.findOne({where : {id : jsonRes.exerciseTrain[i].exerciseId}});

        }

        res.render('../views/train-detail',  {layout: '../views/main', train : jsonRes });

    } else {

        res.statusCode = 404
        res.render('../views/error/error', {layout: '../views/main', code : res.statusCode, message : 'L\'élément que vous recherchez n\'existe pas.'})

    }
})

router.get('/train/:id_train/play/:day', authenticationChecker, premiumChecker, async (req, res) => {

    const userId = req.user.id; 
    const trainId = req.params.id_train
    const day = req.params.day;

    const train = await Train.findOne({where : {id : trainId, userId : userId}});

    if (train) {

        res.render('../views/train-detail-play',  {layout: '../views/main', day : day, train : train });

    } else {

        res.statusCode = 404
        res.render('../views/error/error', {layout: '../views/main', code : res.statusCode, message : 'L\'élément que vous recherchez n\'existe pas.'})

    }
})

router.get('/api/train/:id_train/exercise/:day', authenticationCheckerApi, premiumChecker, async (req, res) => {

    const userId = req.user.id; 
    const trainId = req.params.id_train
    const day = req.params.day;

    const train = await Train.findOne({where : {id : trainId, userId : userId}});
    const exerciseTrain = await ExerciseTrain.findAll({where : {trainId : trainId, day : day}});

    if (exerciseTrain && train) {

        res.statusCode = 200;
        res.send({code : res.statusCode, message : 'All exercise of this train have been found', data : exerciseTrain})

    } else {

        res.statusCode = 404
        res.send({code : res.statusCode, message : 'No exercise found for this train'})

    }
})

router.get('/api/train', authenticationCheckerApi, premiumChecker, async (req, res) => {

    const userId = req.user.id; 

    var trains = await Train.findAll({where:{userId: userId}});

    if (trains) {

        res.statusCode = 200
        
        res.send({code: res.statusCode, message: 'Trains models have been requested', data: trains});

    } else {

        res.statusCode = 404;
        res.send({code:res.statusCode, message : 'No train models found' + id});

    }

})

router.get('/train/request', authenticationChecker, premiumChecker, (req, res) => {

    res.render('../views/train-request',  {layout: '../views/main' });


})

router.get('/api/admin/train/request/:id_train_request/train', adminCheckerApi, async (req, res) => {

    const idTrainRequest = req.params.id_train_request;
    const train = await Train.findOne({where : {trainRequestId: idTrainRequest}})

    if (train) {
    
        res.statusCode = 200
        res.send({code: res.statusCode, message: 'The train associated to this train request has been found', data : train});

    } else {

        res.statusCode = 404
        res.send({code: res.statusCode, message: 'The train associated to this train request hasn\'t been found'});

    }
})

router.get('/admin/train', adminChecker, (req, res) => {

    res.render('../views/admin/train',  {layout: '../views/main-admin' });

})

router.get('/admin/train/request/:id_request', adminChecker, (req, res) => {

    const idRequest = req.params.id_request;
    
    res.render('../views/admin/train-request-detail',  {layout: '../views/main-admin', id_request: idRequest});

})

router.post('/api/admin/train', adminCheckerApi, async (req, res) => {

    const rawTrain = req.body.train;
    const rawExercisesTrain = req.body.exercicesTrain;
    let exercisesTrains = [];

    let train = await Train.create(rawTrain);

    rawExercisesTrain.forEach(async(rawExerciseTrain) => {
        
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

router.patch('/api/admin/train', adminCheckerApi, async (req, res) => {

    const rawTrain = req.body.train;
    const rawExercisesTrains = req.body.exercicesTrain;
    let exercisesTrains = [];

    let train = await Train.findOne({where : {trainRequestId : rawTrain.trainRequestId}})
    await train.update(rawTrain);
    train.save();

    await ExerciseTrain.destroy({where : {trainId : train.id}});

    rawExercisesTrains.forEach(async(rawExerciseTrain) => {
        
        let exerciseTrain = await ExerciseTrain.create(rawExerciseTrain)
        await train.setExerciseTrain(exerciseTrain);
        exercisesTrains.push(exerciseTrain);
    
    });

    if (train){

        res.statusCode = 201
        res.send({code: res.statusCode, message:'Train has been created', data:{train : train, exerciseTrains:exercisesTrains}});

    } else {

        res.statusCode = 404
        res.send({code: res.statusCode, message:'This Train hasn\'t been created'});

    }

});

router.get('/api/admin/train/request/:id_request', adminCheckerApi, async (req, res) => {

    const id = req.params.id_request

    trainRequest = await TrainRequest.findOne({where: {id: id}})

    if (trainRequest){

        const passedSports = await PassedSport.findAll({where: {trainRequestId: trainRequest.id}});
        const passedInjuries = await PassedInjury.findAll({where: {trainRequestId: trainRequest.id}});

        const data = JSON.stringify({trainRequest, 'passedSports' : passedSports, 'passedInjuries' : passedInjuries});

        res.statusCode = 200;
        res.send({'code': res.statusCode, 'message': 'Train request has been found', 'data': data});

    } else {

        res.statusCode = 404;
        res.send({'code': res.statusCode, 'message': 'The train request model can\'t be reached '});

    }
})

router.get('/api/admin/train/request', adminCheckerApi, async (req, res) => {

    trainRequests = await TrainRequest.findAll()

    if (trainRequests) {

        res.statusCode = 200;
        res.send({'code': res.statusCode, 'message': 'Train requests has been found', 'data': trainRequests});

    } else {

        res.statusCode = 404;
        res.send({'code': res.statusCode, 'message': 'The train request models can\'t be reached '});

    }

})

router.post('/api/train/request', authenticationCheckerApi, async (req, res) => {

    const userId = req.user.id;

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