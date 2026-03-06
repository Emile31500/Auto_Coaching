const express = require('express');
const { Exercise, ExerciseTrain, Program, Train, User} = require('../models/');
const router = express.Router();
var authenticationChecker = require('../middlewares/authenticationChecker')
var authenticationCheckerApi = require('../middlewares/authenticationCheckerApi')
var adminCheckerApi = require('../middlewares/adminCheckerApi');
const premiumChecker = require('../middlewares/premiumChecker');

router.get('/train', authenticationChecker, premiumChecker, async ( req, res) => {


    programs = await Program.findAll({
        include : {
            model : Train,
            include : {
                model : ExerciseTrain
            }
        }
    })

    res.render('../views/train',  {
        user : req.user,
        programs : programs,
        page : '/train',
        layout: '../views/main' 
    });

})

router.get('/train/:id/play',  authenticationChecker, premiumChecker, async ( req, res) => {

    const id = req.params.id

    const train = await Train.findOne({
        include : {
            model : ExerciseTrain,
            include : {
                model : Exercise
            }
        },
        where : {
            id : id
        }
    })

    res.render('../views/train-play',  {
        user : req.user,
        train : train,
        page : '/train',
        layout: '../views/main' 
    });

})

router.get('/program/:id', authenticationChecker, premiumChecker, async (req, res) => {

    const id = req.params.id

    const program = await Program.findOne({
        include : {
            model : Train,
            include : {
                model : ExerciseTrain,
                include : {
                    model : Exercise
                },
                require : false

            },
            require : false
        },
        where : {
            id : id
        }
    });

    res.render('../views/train-detail', {
        user : req.user,
        layout : '../views/main',
        program : program,
        page : '/train'
    });
})

router.get('/api/train/:id', async (req, res) => {

    const id = req.params.id;

    var train = await Train.findOne({
        include : {
            model : ExerciseTrain,
            include : {
                model : Exercise
            }
        },
        where:{id: id}
    });

    if (train) {

        res.statusCode = 200

        res.send({code: res.statusCode, message: 'Trains models have been requested', data: train});

    } else {

        res.statusCode = 404;
        res.send({code:res.statusCode, message : 'No train models found' + id});

    }

})

module.exports = router;
