const express = require('express');
var parserJson = require('../middlewares/parserJson');
var authenticationChecker = require('../middlewares/authenticationChecker');
const url = require('url');

const router = express.Router();
const FoodService = require('../services/food');
const FileService = require('../services/file');
const { Op } = require('sequelize');
const { Dish, DishFood, Food } = require('../models');
const multer  = require('multer')
const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
const finalName = 'dish-image-' + uniqueSuffix;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/media/photo/');
    },
    filename: function (req, file, cb) {
        cb(null, finalName);
    }
})

router.get('/dish', authenticationChecker, parserJson, async(req, res, next) => {

    const parsedUrl = url.parse(req.url, true);

    const food = await FoodService.getForMainPage(parsedUrl.query, req.user)
    const countFilter = await FoodService.countFilters(parsedUrl.query)
    const rawDishFoods = String(parsedUrl.query.dishFoods);
    let myDishFoods = [];

   if (rawDishFoods !== 'undefined') {

        myDishFoods = rawDishFoods.split(',')
        for (let index = 0; index < myDishFoods.length; index++) {

            myDishFood = myDishFoods[index].split('=');

            myFood = await Food.findOne({where : {
                id :  myDishFood[0],
                [Op.or] : [
                    { userId : req.user.id },
                    { userId : null }
                ]
            }})

            myDishFoods[index] = { 
                food : myFood,
                weight : myDishFood[1]
            };
            
        }
    }

    res.render('../views/dish',  {
        dish : null, 
        food : food,
        myDishFoods : myDishFoods,
        countFilter : countFilter,
        parsedUrlQuery : parsedUrl.query,
        todoDelteThisOption : true,
        layout: '../views/main' 

    });


})

router.post('/dish', authenticationChecker, parserJson, multer({
                storage: storage, 
                limits: {
                    fileSize: 1024 * 5 * 1024
                }
            }).single('image'),  async(req, res, next) => {
    

    if (req.body && req.session.token){

        try {
        
            const rawData = req.body;
            
            const jsonSafe = rawData.foodsDish.replace(/(\w+):/g, '"$1":');
            const foodsDish = JSON.parse(jsonSafe);
            const upload = multer({ dest: 'uploads/' })

            const dish = await Dish.create({
                name : rawData.name,
                userId : req.user.id,
                imageUrl : finalName,
            })      
            
            finitFoodDish(foodsDish, dish, user)
            // foodsDish.forEach(async(foodDish) => {

            //     const food = await Food.findOne({where : {
            //             id : foodDish.foodId,
            //             [Op.or] : [
            //                 { userId : req.user.id },
            //                 { userId : null }
            //             ]
            //         }
            //     });

            //     const dishFood = DishFood.create({
            //         foodId : food.id,
            //         dishId : dish.id,
            //         weight : foodDish.weight
            //     });
                
            // });

            res.redirect('/nutrition')
        
        } catch (error) {

            res.redirect('/dish')
        }   

    }
    
})

router.post('/dish/edit/:id', authenticationChecker, parserJson, async(req, res, next) => {
    
    if (req.body && req.session.token){

        try {

            const dish = await Dish.findOne({
                include : [{
                    model : DishFood,
                    include : [
                        Food
                    ]
                }],
                where : {
                    id : req.params.id,
                    [Op.or] :[
                        {userId : req.user.id},
                        {userId : null}
                ]}
            })

        
            const rawData = req.body;
            const jsonSafe = rawData.foodsDish.replace(/(\w+):/g, '"$1":');
            const foodsDish = JSON.parse(jsonSafe);
            console.log(foodsDish)
            console.log(foodsDish[0])
            console.log(foodsDish[0].foodId)

            for (let index = 0; index < dish.DishFoods.length; index++) await dish.DishFoods[index].destroy();
            finitFoodDish(foodsDish, dish, user)

        } catch (error) {

            res.redirect('/dish/edit/'+req.params.id)
        }

        res.redirect('/nutrition')


    }
})


router.get('/dish/edit/:id', authenticationChecker, parserJson, async(req, res, next) => {

    const parsedUrl = url.parse(req.url, true);
    const food = await FoodService.getForMainPage(parsedUrl.query, req.user)
    const countFilter = await FoodService.countFilters(parsedUrl.query)

    let myDishFoods = []
    
    const dish = await Dish.findOne({
        include : [
            {
                model : DishFood,
                include : [
                    Food
                ]
            }
        ],
        where : {
            id : req.params.id,
            [Op.or] :[
                {userId : req.user.id},
                {userId : null}
            ]
        }
    })


    for (let index = 0; index < dish.DishFoods.length; index++) {
        myDishFoods[index] = {
            food : dish.DishFoods[index].Food,
            weight : dish.DishFoods[index].weight
        }
    }

    res.render('../views/dish',  {
        dish : dish,
        food : food,
        countFilter : countFilter,
        myDishFoods : myDishFoods,
        parsedUrlQuery : parsedUrl.query,
        todoDelteThisOption : false,
        layout: '../views/main' 

    });
})

router.delete('/dish/delete/:id', authenticationChecker, parserJson,  async(req, res, next) => {

    const dish = await Dish.findOne({where : {
        id : req.params.id,
        userId : req.user.id
    }})

    if (dish !== undefined) await dish.destroy();

    res.redirect('/nutrition')

    
})

function finitFoodDish (foodsDish, dish, user) {


    foodsDish.forEach(async(foodDish) => {

        const food = await Food.findOne({where : {
                id : foodDish.foodId,
                [Op.or] : [
                    { userId : user.id },
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
}

module.exports = router
