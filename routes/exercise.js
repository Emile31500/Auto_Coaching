const express = require('express');
const { Exercise } = require('../models');
var parserJson = require('../middlewares/parserJson');
var authenticationChecker = require('../middlewares/authenticationChecker')
var adminChecker = require('../middlewares/adminChecker')
const router = express.Router();


router.get('/api/admin/exercise', adminChecker, parserJson, async(req, res, next) => {

    var exercise = await Exercise.findAll();

    if (exercise) {

        res.statusCode = 200;
        res.send({'code' : res.statusCode, 'message': 'Exercises model successfully requested', 'data': exercise});

    } else {

        res.statusCode = 404;
        res.send({'code' : res.statusCode, 'message' : 'Exercises was not found   '});

    }
    

});

router.post('/api/admin/exercise', adminChecker, parserJson, async(req, res, next) => {

    const rawData = req.body

    var exercise =  Exercise.create(rawData);

    if (exercise) {

        res.statusCode = 201;
        res.send({'code' : res.statusCode, 'message': 'Exercise instance successfully created', 'data': exercise});

    } else {

        res.statusCode = 401;
        res.send({'code' : res.statusCode, 'message' : 'Exercises was not found   '});

    }
    

});

router.delete('/api/admin/exercise/:id_exercise', adminChecker, parserJson, async(req, res, next) => {

    const idExercise = req.params.id_exercise;
    exercise = Exercise.findOne({where: {id: idExercise}});


    if (exercise){

        Exercise.destroy({where: {id: idExercise}});

        if (exercise) {
    
            res.statusCode = 202;
            res.send({'code' : res.statusCode, 'message': 'Exercise instance successfully created'});
    
        } else {
    
            res.statusCode = 401;
            res.send({'code' : res.statusCode, 'message' : 'Exercises was not found'});
    
        }

    } else {

        res.statusCode = 404;
        res.send({'code' : res.statusCode, 'message' : 'Exercises was not found'})

    }
});

module.exports = router
