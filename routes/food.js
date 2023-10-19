const express = require('express');
const { AteFood, User } = require('../models');
var parserJson = require('../middlewares/parserJson');
const session = require('express-session');



const router = express.Router()

router.post('/food/eat', parserJson, async (req, res, next) => {

    if (req.body && req.session.token){

        var user = await User.findOne({where: {authToken:  req.session.token}});

        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        let currentDate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds

        ateFood = AteFood.create({
            userId: user.Id,
            foodId: req.body.foodId,
            weight: req.body.weight,
            createdAt: currentDate,
            updatedAt: currentDate

        });
        
        res.statusCode = 201;
        res.send(ateFood);
    }

})

 module.exports = router