const express = require('express');
const { AteFood, User, Food, Sequelize } = require('../models');
var parserJson = require('../middlewares/parserJson');
var authenticationChecker = require('../middlewares/authenticationChecker')
const { Op } = require('sequelize');
const session = require('express-session');
const http = require('http');
const url = require('url');
const router = express.Router();


router.get('/api/food', authenticationChecker, parserJson, async(req, res, next) => {

    const parsedUrl = url.parse(req.url, true);
    const id = parsedUrl.query.id;

    var food = await Food.findOne({where: {id: id}});

    if (food) {

        res.statusCode = 200;
        res.send({'code' : res.statusCode, 'message': 'This food model successfully requested', 'data': food});

    } else {

        res.statusCode = 404;
        res.send({'code' : res.statusCode, 'message' : 'This food was not found of id ' + id});

    }
    

});


router.get('/food/add', async(req, res, next) => {

    res.render('../views/food-add',  {layout: '../views/main' });
    
});


router.get('/api/food/eat', authenticationChecker, parserJson, async(req, res, next) => {

    if (req.session.token){

        const parsedUrl = url.parse(req.url, true);
        const dateStart = parsedUrl.query.dateStart;
        const dateEnd = parsedUrl.query.dateEnd;

        const user = await User.findOne({ where: {authToken: req.session.token}})


        if (user) {
            
            let food = await AteFood.findAll({
                                                where: {
                                                    userId: user.id,
                                                    createdAt: {
                                                        [Op.between]: [dateStart, dateEnd],
                                                      }
                                                }
                                            });

            if (food){

                res.statusCode = 200;
                res.send({'code': res.statusCode, 'message': 'food elements successfully requested', 'data': food});

            } else {

                res.statusCode = 404
                res.send({'code': res.statusCode, 'message' : 'Ate Food not found'});
            }

        } else {

            res.statusCode = 400;
            res.send({"message" : "User not found"});

        }

    } else {

        res.statusCode = 401;
        res.send({"message" : "User not authenticated"});

    } 
    
});

router.post('/api/food', parserJson, async (req, res, next) => {

    if (req.body && req.session.token){

        food = await Food.create(req.body);

        if (food){

            res.statusCode = 201
            res.send(food);

        } else {

            res.statusCode = 401
            res.send({"message" : "Food not created"});

        }


    }

});


router.post('/api/food/eat', authenticationChecker, parserJson, async (req, res, next) => {

    if (req.body && req.session.token){

        var user = await User.findOne({where: {authToken:  req.session.token}});

        req.body.userId = user.id;
        ateFood = AteFood.create(req.body);
        
        res.statusCode = 201;
        res.send(ateFood);

    } else {

        res.statusCode = 401;
        res.send({"message" : "data required unprovided"});

    }

})

 module.exports = router