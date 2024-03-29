const express = require('express');
const { Exercise } = require('../models');
var parserJson = require('../middlewares/parserJson');
var authenticationCheckerApi = require('../middlewares/authenticationChecker')
var adminCheckerApi = require('../middlewares/adminCheckerApi');
const premiumChecker = require('../middlewares/premiumChecker');
const router = express.Router();


router.get('/api/exercise/:id_exercise', authenticationCheckerApi, premiumChecker, parserJson, async(req, res, next) => {

    const idEx = req.params.id_exercise;
    const exercise = await Exercise.findOne({ where : {id : idEx}});

    if (exercise) {

        res.statusCode = 200;
        res.send({code : res.statusCode, message: 'Exercise  successfully requested', data: exercise});

    } else {

        res.statusCode = 404;
        res.send({code : res.statusCode, message : 'Exercises was not found'});

    }
    

});

router.get('/api/admin/exercise', adminCheckerApi, parserJson, async(req, res, next) => {

    var exercise = await Exercise.findAll();

    if (exercise) {

        res.statusCode = 200;
        res.send({code : res.statusCode, message: 'Exercises model successfully requested', data: exercise});

    } else {

        res.statusCode = 404;
        res.send({code : res.statusCode, message : 'Exercises was not found'});

    }
    

});

router.post('/api/admin/exercise', adminCheckerApi, parserJson, async(req, res, next) => {

    const rawData = req.body

    var exercise = await Exercise.create(rawData);

    if (exercise) {

        res.statusCode = 201;
        res.send({code : res.statusCode, message: 'Exercise instance successfully created', data: exercise});

    } else {

        res.statusCode = 401;
        res.send({code : res.statusCode, message : 'Exercises was not found'});

    }
    

});

router.delete('/api/admin/exercise/:id_exercise', adminCheckerApi, parserJson, async(req, res, next) => {

    const idExercise = req.params.id_exercise;
    let exercise = await Exercise.findOne({where : {id: idExercise}});

    if (exercise){

        Exercise.destroy({where: {id: idExercise}});
        let exerciseDel = await Exercise.findOne({where : {id: idExercise}});

        if (!exerciseDel) {
    
            res.statusCode = 204;
            res.send({code : res.statusCode, message: 'Exercise instance successfully delated'});
    
        } else {
    
            res.statusCode = 500;
            res.send({code : res.statusCode, message : 'This exercise delation didn\'t works'});
    
        }

    } else {

        res.statusCode = 404;
        res.send({code : res.statusCode, message : 'This exercise was not found'});

    }


});

module.exports = router
