const express = require('express');
const { Food } = require('../models');
const FoodService = require('../services/food');

var parserJson = require('../middlewares/parserJson');
var authenticationCheckerApi = require('../middlewares/authenticationCheckerApi')

const { Op } = require('sequelize');
const session = require('express-session');
const adminCheckerApi = require('../middlewares/adminCheckerApi');

const url = require('url');
const premiumChecker = require('../middlewares/premiumChecker');
const router = express.Router();

router.delete('/api/food/:id_food', authenticationCheckerApi, parserJson, async(req, res, next) => {

    const idFood = req.params.id_food;
    
    if (user.role.includes('admin') == true) {
        whereUserId = null;
    } else {
        whereUserId = req.use.id;
    }

    let food = await Food.findOne({where : {id: idFood, userId : whereUserId}});

    if (food){
        
        Food.destroy({where: {id: idFood, userId : null}});
        let foodDel = await Food.findOne({where : {id: idFood, userId : null}});

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

router.get('/api/food', authenticationCheckerApi, parserJson, premiumChecker, async(req, res, next) => {

    const parsedUrl = url.parse(req.url, true);
    let food = await FoodService.getForMainPage(parsedUrl.query, req.user)

    if (food) {

        res.statusCode = 200;
        res.send({code : res.statusCode, message: 'This food model successfully requested', data : food});

    } else {

        res.statusCode = 404;
        res.send({code : res.statusCode, message : 'None food have been found'});

    }  

});

router.get('/api/food/:id_food', authenticationCheckerApi, parserJson, premiumChecker, async(req, res, next) => {

    const id = req.params.id_food;

    var food = await Food.findOne({where: {
            id: id,
            [Op.or] : [
                { userId : req.user.id },
                { userId : null }
            ]
        }
    });

    if (food) {

        res.statusCode = 200;
        res.send({'code' : res.statusCode, 'message': 'This food model successfully requested', 'data': food});

    } else {

        res.statusCode = 404;
        res.send({'code' : res.statusCode, 'message' : 'This food was not found of id ' + id});

    }
});

router.get('/food/add', premiumChecker, async(req, res, next) => {

    res.render('../views/food-add',  {
        page : '/nutrition',
        layout: '../views/main'
    });
    
});


router.post('/api/food', parserJson, adminCheckerApi, async (req, res, next) => {

    if (req.body && req.session.token){

        const rawData = req.body

         if (user.role.includes('admin') == true) {
            userIdValue = null;
        } else {
            userIdValue = req.use.id;
        }


        let food = Food.create(rawData);
        food.userId = userIdValue 

        if (food){

            res.statusCode = 201
            res.send({'code': res.statusCode, 'message': 'This food has been created', 'data': food});

        } else {

            res.statusCode = 400
            res.send({'code': res.statusCode, "message" : "Food not created"});

        }
    }
});

router.patch('/api/admin/food/:id_food', parserJson, adminCheckerApi, async (req, res, next) => {

    if (req.body){

        const idFood = req.params.id_food;

        var food = await Food.findOne({where : {id: idFood,  userId : null}});
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