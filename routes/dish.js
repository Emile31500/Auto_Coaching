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



// const upload = multer({ dest: 'public/media/photo/' })

router.get('/dish', authenticationChecker, parserJson, async(req, res, next) => {

    const parsedUrl = url.parse(req.url, true);

    const food = await FoodService.getForMainPage(parsedUrl.query, req.user)
    const countFilter = await FoodService.countFilters(parsedUrl.query)
    const rawDishFoods = String(parsedUrl.query.dishFoods);
    let myDishFoods = [];

   if (rawDishFoods !== 'undefined') {

        myDishFoods = rawDishFoods.split(',')
        console.log(myDishFoods)
        console.log(myDishFoods.length)
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

    console.log(myDishFoods)

    res.render('../views/dish',  {
        food : food,
        myDishFoods : myDishFoods,
        countFilter : countFilter,
        parsedUrlQuery : parsedUrl.query,
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
            console.log(rawData.image)

            const dish = await Dish.create({
                name : rawData.name,
                userId : req.user.id,
                imageUrl : finalName,
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
