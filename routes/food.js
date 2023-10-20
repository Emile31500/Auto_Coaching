const express = require('express');
const { AteFood, User, Food } = require('../models');
var parserJson = require('../middlewares/parserJson');
var authenticationChecker = require('../middlewares/authenticationChecker')
const session = require('express-session');




const router = express.Router()


router.post('/food', parserJson, async (req, res, next) => {

    if (req.body && req.session.token){

        food = await Food.create(req.body);

        res.send(food);

    }

});


router.post('/food/eat', authenticationChecker, parserJson, async (req, res, next) => {

    if (req.body && req.session.token){

        console.log(req.body);

        var user = await User.findOne({where: {authToken:  req.session.token}});

        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        let currentDate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds 

        ateFood = AteFood.create(req.body);

        ateFood.userId = user.Id;
        ateFood.createdAt = currentDate;
        ateFood.updatedAt = currentDate;
        
        res.statusCode = 201;
        res.send(ateFood);

    } else {

        res.statusCode = 401;
        res.send({"message" : "data required unprovided"});

    }

})

 module.exports = router