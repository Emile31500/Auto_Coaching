const express = require('express');
const { AteFood, User, Food, Sequelize } = require('../models');
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


router.get('/api/food/eat/:start_date/:end_date', authenticationChecker, parserJson, premiumChecker, async(req, res, next) => {

    const dateStart = req.params.start_date;
    const dateEnd = req.params.end_date;
        
    console.log(dateStart);
    console.log(dateEnd);
    console.log(req.user.id);

    let food = await AteFood.findAll({
                                        where: {
                                            userId: req.user.id,
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

router.patch('/api/admin/food', parserJson, async (req, res, next) => {

    if (req.body && req.session.token){

        const element = req.body.element
        const selector = req.body.selector


        var food = await Food.findOne({where : selector});
        await food.update(element);
        await food.save();
        // foodUnUpdated = await Food.findOne({where : selector}); 
        

        // if (foodUnUpdated){

        //     await Food.update(element, {where : selector}
        //     );

        //     foodUpdated = await Food.findOne({where : selector}); 

        //     if (foodUnUpdated !== foodUpdated) {

        //         res.statusCode = 202
        //         res.send({'code': res.statusCode, 'message': 'This food has been updated', 'data': foodUpdated});

        //     } else {

        //         res.statusCode = 422
        //         res.send({'code': res.statusCode, 'message': 'Update of this food is a failure'});

        //     }

            

        // } else {

        //     res.statusCode = 404
        //     res.send({'code': res.statusCode, "message" : "Food not updated"});

        // }
    }
});

router.post('/api/food/eat', authenticationChecker, parserJson, async (req, res, next) => {

    if (req.body && req.session.token){

        req.body.userId = req.user.id;
        ateFood = AteFood.create(req.body);
        
        res.statusCode = 201;
        res.send(ateFood);

    } else {

        res.statusCode = 401;
        res.send({"message" : "data required unprovided"});

    }

})

 module.exports = router