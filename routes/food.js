const express = require('express');
const { Food, Sequelize } = require('../models');
var parserJson = require('../middlewares/parserJson');
var authenticationChecker = require('../middlewares/authenticationChecker')
const { Op } = require('sequelize');
const session = require('express-session');
const http = require('http');
const url = require('url');
const adminChecker = require('../middlewares/adminChecker');
const premiumChecker = require('../middlewares/premiumChecker');
const router = express.Router();

router.delete('/api/admin/food/:id_food', adminChecker, parserJson, async(req, res, next) => {

    const idFood = req.params.id_food;
    let food = await Food.findOne({where : {id: idFood}});

    if (food){

        Food.destroy({where: {id: idFood}});
        let foodDel = await Food.findOne({where : {id: idFood}});

        if (!foodDel) {
    
            res.statusCode = 204;
            res.send({'code' : res.statusCode, 'message': 'Food instance successfully delated'});
    
        } else {
    
            res.statusCode = 500;
            res.send({'code' : res.statusCode, 'message' : 'This food delation didn\'t works'});
    
        }

    } else {

        res.statusCode = 404;
        res.send({'code' : res.statusCode, 'message' : 'This food was not found'});

    }

});

router.get('/api/food/:id_food', authenticationChecker, parserJson, premiumChecker, async(req, res, next) => {

    const id = req.params.id_food;

    var food = await Food.findOne({where: {id: id}});

    if (food) {

        res.statusCode = 200;
        res.send({'code' : res.statusCode, 'message': 'This food model successfully requested', 'data': food});

    } else {

        res.statusCode = 404;
        res.send({'code' : res.statusCode, 'message' : 'This food was not found of id ' + id});

    }
    

});


router.get('/food/add', premiumChecker, async(req, res, next) => {

    res.render('../views/food-add',  {layout: '../views/main' });
    
});


    router.post('/api/admin/food', parserJson, adminChecker, async (req, res, next) => {

        if (req.body){

            req.body.is_veggie = !(req.body.is_meat || req.body.is_milk || req.body.is_egg)

            food = await Food.create(req.body);
            
            if (food){

                res.statusCode = 201
                res.send({code: res.statusCode, message: 'This food has been has been created', data: food});

            } else {

                res.statusCode = 401
                res.send({"message" : "Food not created"});

            }
        }

    });

    router.post('/api/admin/food', parserJson, async (req, res, next) => {

        if (req.body && req.session.token){

            const rawData = req.body

            const food = Food.create(rawData);
            if (food){

                res.statusCode = 201
                res.send({'code': res.statusCode, 'message': 'This food has been created', 'data': food});

            } else {

                res.statusCode = 400
                res.send({'code': res.statusCode, "message" : "Food not created"});

            }
        }
    });

router.patch('/api/admin/food/:id_food', parserJson, adminChecker, async (req, res, next) => {

    if (req.body){

        const idFood = req.params.id_food;

        var food = await Food.findOne({where : {id: idFood}});
        const foodUnUpdated = food;
        await food.update(req.body);
        await food.save();
        

        if (foodUnUpdated){

            const foodUpdated = await Food.findOne({where : {id : idFood}});

            if (foodUnUpdated !== foodUpdated) {

                res.statusCode = 202
                res.send({'code': res.statusCode, 'message': 'This food has been updated', 'data': foodUpdated});

            } else {

                res.statusCode = 422
                 res.send({'code': res.statusCode, 'message': 'Update of this food is a failure'});

            }

            

        } else {

            res.statusCode = 404
            res.send({'code': res.statusCode, "message" : "Food not updated"});

        }
    }
});

 module.exports = router