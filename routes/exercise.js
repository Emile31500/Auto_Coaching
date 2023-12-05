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

module.exports = router
