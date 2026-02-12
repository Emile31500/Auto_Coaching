const express = require('express');
const { AteFood, Food, NutritionRequirement, Dish, DishFood } = require('../models/');
const { Op } = require('sequelize');
const FoodService = require('../services/food');

var parserJson = require('../middlewares/parserJson');
const router = express.Router();
const authenticationChecker = require('../middlewares/authenticationChecker');
const adminChecker = require('../middlewares/adminChecker');
const premiumChecker = require('../middlewares/premiumChecker');
const url = require('url')

router.get('/nutrition/:date', authenticationChecker, premiumChecker, async (req, res) => {

    const parsedUrl = url.parse(req.url, true);
    const food = await FoodService.getForMainPage(parsedUrl.query, req.user)
    const date = new Date(req.params.date);

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

    const ateFood = await AteFood.findAll({ group: 'date' });


    const countFilter = await FoodService.countFilters(parsedUrl.query)

    res.locals.message = req.flash();
    res.render('../views/nutrition',  { 
        food: food,
        dish: dish,
        date: date,
        ateFoods : ateFood,
        parsedUrlQuery : parsedUrl.query,
        countFilter : countFilter,
        layout: '../views/main'
    });

})

router.post('/nutrition', parserJson, authenticationChecker, premiumChecker, async (req, res) => {

    try {

        if (req.body && req.session.token){

            const rawData = req.body
            const food = Food.create(rawData);
            req.flash('success', 'Cet aliment a bien été créé')

        } else {

            throw  'soumission du formulaire non valide';

        }

    } catch (error) {
        req.flash('danger', error)
    }
        
    res.locals.message = req.flash();
    const date = new Date()
    res.redirect('/nutrition/'+ date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear());

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