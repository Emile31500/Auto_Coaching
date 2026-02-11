const express = require('express');
const { Food, NutritionRequirement, Dish, DishFood } = require('../models/');
const { Op } = require('sequelize');
const FoodService = require('../services/food');

var parserJson = require('../middlewares/parserJson');
const router = express.Router();
const authenticationChecker = require('../middlewares/authenticationChecker');
const adminChecker = require('../middlewares/adminChecker');
const premiumChecker = require('../middlewares/premiumChecker');
const url = require('url')

router.get('/nutrition', authenticationChecker, premiumChecker, async (req, res) => {

    const parsedUrl = url.parse(req.url, true);
    const food = await FoodService.getForMainPage(parsedUrl.query, req.user)

    const dish = await Dish.findAll({
        include : [
            {
                model : DishFood,
                include : [
                    Food
                ]
            }
        ],
        where : {
            [Op.or] :[
                {userId : req.user.id},
                {userId : null}
            ]
        }
    })

    const countFilter = await FoodService.countFilters(parsedUrl.query)

    res.render('../views/nutrition',  { 
        food: food,
        dish: dish,
        parsedUrlQuery : parsedUrl.query,
        countFilter : countFilter,
        layout: '../views/main'
    });

})

router.post('/nutrition', parserJson, authenticationChecker, premiumChecker, async (req, res) => {

    if (req.body && req.session.token){

        const rawData = req.body
        const food = Food.create(rawData);

    }

    res.redirect('/nutrition');

})

router.get('/api/nutrition/requirement', authenticationChecker, premiumChecker, async (req, res) => {
    
    const userId = req.user.id

    var nutritionRequirement = await NutritionRequirement.findOne({where : {userId : userId}, order: [['createdAt', 'DESC']]});

    if (nutritionRequirement) {

        res.statusCode = 200;
        res.send({code : res.statusCode, message : 'This nutrition requirement was found', data : nutritionRequirement});

    } else {

        res.statusCode = 404;
        res.send({code: res.statusCode, message: 'This nutrition requirement wasn\'t found'});

    }

})

router.patch('/api/nutrition/requirement', authenticationChecker, premiumChecker, async (req, res) => {

    let data = req.body

    var nutritionRequirement = await NutritionRequirement.findOne();
    const unupdatedNutritionRequirement = nutritionRequirement;
    await nutritionRequirement.update(data);
    await nutritionRequirement.save();

    if (unupdatedNutritionRequirement) {
        
        if (unupdatedNutritionRequirement != nutritionRequirement) {

            res.statusCode = 204
            res.send({code : res.statusCode, message : 'Update of this nutrition requirement works', data : data});

        } else {

            res.statusCode = 422
            res.send({code: res.statusCode, message: 'Update of this food is a failure'});

        }

    } else {

        res.statusCode = 404
        res.send({code: res.statusCode, message : "Food not updated"});

    }
});

router.get('/admin/nutrition', adminChecker, async (req, res) => {
    
    var food = await Food.findAll();
    res.render('../views/admin/nutrition',  { food: food, layout: '../views/main-admin' });

})

 module.exports = router