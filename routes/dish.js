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

/*router.get('/temp/dish', async(req, res, next) => {

    const dishes = await Dish.findAll({ include : [{
        model : DishFood,
        include : [{
            model : Food
        }]
    }]});

    dishes.forEach(async (dish) => {
       await dish.calculateSumMacro();
    });

})*/

router.get('/dish', authenticationChecker, parserJson, async(req, res, next) => {

    const parsedUrl = url.parse(req.url, true);

    const food = await FoodService.getFoodsForMainPage(parsedUrl.query, req.user)
    const countFilter = await FoodService.countFilters(parsedUrl.query)
    const rawDishFoods = String(parsedUrl.query.dishFoodsFilter);
    console.log(rawDishFoods)
    const myDishFoods = [];
    console.log('rawDishFoods')
    console.log(rawDishFoods)

    if (rawDishFoods.includes('spl1t3r')) {

        splitedDishFoods = rawDishFoods.split(',')
      

        // await splitedDishFoods.forEach(async (splitedDishFood) => {
        console.log('splitedDishFoods')
        console.log(splitedDishFoods)
        for (const splitedDishFood of splitedDishFoods) {

            spitdTwiceDishFood = splitedDishFood.split('spl1t3r');
            console.log(spitdTwiceDishFood[0])
            console.log(spitdTwiceDishFood[1])

            myFood = await Food.findOne({where : {
                id :  spitdTwiceDishFood[0],
                [Op.or] : [
                    { userId : req.user.id },
                    { userId : null }
                ]
            }})

            myDishFoods.push({ 
                food : myFood,
                weight : spitdTwiceDishFood[1]
            });
        };

    }

    console.log('myDishFoods : ')
    console.log(myDishFoods)

    res.render('../views/dish',  {
        page : '/nutrition',
        dish : null, 
        food : food,
        myDishFoods : myDishFoods,
        countFilter : countFilter,
        parsedUrlQuery : parsedUrl.query,
        todoDelteThisOption : true === false,
        layout: '../views/main' 

    });


})

router.post('/dish', authenticationChecker, parserJson,  async(req, res, next) => {
    

    try {
        
        if (req.body && req.session.token){
    
            const rawData = req.body;
            
            const jsonSafe = rawData.foodsDish.replace(/(\w+):/g, '"$1":');
            const foodsDish = JSON.parse(jsonSafe);
            console.log(foodsDish)

            const dish = await Dish.create({
                name : rawData.name,
                userId : req.user.id,
                imageUrl : rawData.imageUrl,
            })    
            
            await finitFoodDish(foodsDish, dish, user)

            const date = new Date()
            req.flash('success', 'Votre plat a bien été créé')
            res.locals.message = req.flash();
            res.redirect('/nutrition/'+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate());


        } else {
            throw new Error('soumission du formulaire non valide');
        }

    
    } catch (error) {

        req.flash('danger', error.message)
        res.locals.message = req.flash();
        res.redirect('/dish')
    }   
    
})

router.post('/dish/edit/:id', authenticationChecker, parserJson, async(req, res, next) => {
    
    try {

        if (req.body && req.session.token){
        

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
            if (0 <  rawData.imageUrl.length ) dish.imageUrl = rawData.imageUrl;
            if (0 <  rawData.name.length ) dish.name = rawData.name;
            await dish.save();
            const jsonSafe = rawData.foodsDish.replace(/(\w+):/g, '"$1":');
            const foodsDish = JSON.parse(jsonSafe);

            for (let index = 0; index < dish.DishFoods.length; index++) await dish.DishFoods[index].destroy();
            await finitFoodDish(foodsDish, dish, user)
            req.flash('success', 'Votre plat a bien été édité')
            res.locals.message = req.flash();
        
        } else {

            throw  new Error('soumission du formulaire non valide');

        }
        
    } catch (error) {

        console.log(error)
        req.flash('danger', error.message)
        res.redirect('/dish/edit/'+req.params.id)
    }

    const date = new Date()
    res.redirect('/nutrition/'+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate());



})


router.get('/dish/edit/:id', authenticationChecker, parserJson, async(req, res, next) => {

    const parsedUrl = url.parse(req.url, true);
    const food = await FoodService.getFoodsForMainPage(parsedUrl.query, req.user)
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
        page : '/nutrition',
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

    try {

        const dish = await Dish.findOne({where : {
            id : req.params.id,
            userId : req.user.id
        }})

        if (dish !== undefined) await dish.destroy();
        req.flash('success', 'Ce plat a bien été supprime : les anciennes diète de ce plat ont bien été conservé.')

    } catch (error){

        req.flash('danger', error)

    }

    res.locals.message = req.flash();
    const date = new Date()
    res.redirect('/nutrition/'+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate());


    
})

async function finitFoodDish (foodsDish, dish, user) {

    
    dish.sumKcalorie = 0;	
    dish.sumCarbohydrate = 0; 	
    dish.sumProtein = 0; 	
    dish.sumFat = 0;
    await foodsDish.forEach(async(foodDish) => {

        const food = await Food.findOne({where : {
                id : foodDish.foodId,
                [Op.or] : [
                    { userId : user.id },
                    { userId : null }
                ]
            }
        });

        const dishFood = await DishFood.create({
            foodId : food.id,
            dishId : dish.id,
            weight : foodDish.weight
        });

        dish.sumKcalorie = food.kcalorie * (foodsDish.weight / 100);	
        dish.sumCarbohydrate = food.carbohydrate * (foodsDish.weight / 100); 	
        dish.sumProtein = food.proteine * (foodsDish.weight / 100); 	
        dish.sumFat = food.fat * (foodsDish.weight / 100);
        await dish.save();

    });
}

module.exports = router
