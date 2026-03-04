const express = require('express');
const { Exercise, ExerciseTrain, ExerciseTrainDraft, Program, ProgramDraft, Train, TrainDraft, NutritionRequirement} = require('../models/');
const router = express.Router();
const { Op } = require('sequelize');
var authenticationChecker = require('../middlewares/authenticationChecker')
var authenticationCheckerApi = require('../middlewares/authenticationCheckerApi')
var adminChecker = require('../middlewares/adminChecker');
var adminCheckerApi = require('../middlewares/adminCheckerApi');
const premiumChecker = require('../middlewares/premiumChecker');
const parserJson = require('../middlewares/parserJson');
const program = require('../models/program');


router.get('/admin/program/id/delete', async(req, res) => {

    try {

        req.flash('success', 'Le programme ${program.libele} a bien été supprimé');

    } catch (error) {

        req.flash('danger', error.message)
    }

    res.redirect('/admin/train')

})

router.get('/train', authenticationChecker, premiumChecker, (req, res) => {

    res.render('../views/train',  {
        page : '/train',
        layout: '../views/main' 
    });

})

router.get('/program/:id', authenticationChecker, premiumChecker, async (req, res) => {

    const id = req.params.id

    const programOrNull = await Program.findOne({
        include : {
            model : Train,
            include : {
                model : ExerciseTrain
            }
        },
        where : {id : id}
    });

    if (programOrNull instanceof Program) {

        res.render('../views/train-detail',  {layout: '../views/main', train : program });

    } else {

        res.statusCode = 404
        res.render('../views/error/error', {layout: '../views/main', code : res.statusCode, message : 'L\'élément que vous recherchez n\'existe pas.'})

    }
})

router.get('/program/:idP/train/:idT/play', authenticationChecker, premiumChecker, async (req, res) => {

    const userId = req.user.id;
    const trainId = req.params.idT
    const programId = req.params.idP

    const day = req.params.day;

    const program = await Program.findOne({ 
        include : {
            model : Trains, 
            include : ExerciseTrain,
            where : {
                id : trainId
            },
            require : true
        },
        where : {
            id : programId, 
            userId : userId
        }
    });

    if (train) {

        res.render('../views/train-detail-play',  {layout: '../views/main', train : program.Trains[0] });

    } else {

        res.statusCode = 404
        res.render('../views/error/error', {layout: '../views/main', code : res.statusCode, message : 'L\'élément que vous recherchez n\'existe pas.'})

    }
})

router.get('/api/train/:id_train/day', authenticationCheckerApi, premiumChecker, async (req, res) => {

    const userId = req.user.id;
    const trainId = req.params.id_train

    const train = await Train.findOne({where : {id : trainId, userId : userId}});

    if (train) {

        const days = await train.getDays();

        if (days) {

            res.statusCode = 200;
            res.send({code : res.statusCode, message : 'Days where user trains has been found', data : days})

        } else {

            res.statusCode = 404;
            res.send({code : res.statusCode, message : 'Days where user trains hasn\'t been found', data : days})
        }

    } else {

        res.statusCode = 404
        res.send({code : res.statusCode, message : 'This train dosn\'t exist'});

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

module.exports = router;
