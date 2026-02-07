const express = require('express');
var parserJson = require('../middlewares/parserJson');
var authenticationChecker = require('../middlewares/authenticationChecker');
const url = require('url');

const router = express.Router();
const FoodService = require('../services/food');
const { Op } = require('sequelize');
const { Dish, DishFood, Food } = require('../models');


router.get('/dish', authenticationChecker, parserJson, async(req, res, next) => {

    const parsedUrl = url.parse(req.url, true);

    const food = await FoodService.getForMainPage(parsedUrl.query, req.user)
    const countFilter = await FoodService.countFilters(parsedUrl.query)


    
    res.render('../views/dish',  {
        food : food,
        countFilter : countFilter,
        parsedUrlQuery : parsedUrl.query,
        layout: '../views/main' 

    });


})

router.post('/dish', authenticationChecker, parserJson, async(req, res, next) => {
    

    if (req.body && req.session.token){

        try {
        
            const rawData = req.body
            console.log(rawData)


            const jsonSafe = rawData.foodsDish.replace(/(\w+):/g, '"$1":');
            const foodsDish = JSON.parse(jsonSafe);

            const dish = await Dish.create({
                name : rawData.name,
                userId : req.user.id
            })
            
            foodsDish.forEach(async(foodDish) => {

                const food = await Food.findOne({where : {
                        id : foodDish.foodId,
                        [Op.or] : [
                            { userId : req.user.id },
                            { userId : null }
                        ]
                    }
                });

                const dishFood = DishFood.create({
                    foodId : food.id,
                    dishId : dish.id,
                    weight : foodDish.weight
                });
                
            });

            res.redirect('/nutrition')

        
        } catch (error) {

            res.redirect('/dish')
        }   

    }
    
})

module.exports = router
