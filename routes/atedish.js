const express = require('express');
var parserJson = require('../middlewares/parserJson');
var authenticationChecker = require('../middlewares/authenticationChecker');

const { Op } = require('sequelize');
const router = express.Router();
const { AteFood, Dish, DishFood, Food } = require('../models');

router.post('/ate/dish/:id', authenticationChecker, parserJson, async(req, res, next) => {

    if (req.body && req.session.token){

        try {

            dish = await Dish.findOne({where : {
                id : req.params.id,
                userId : req.user.id
            }}) 

            if (dish === undefined) {

                throw 'Aucun plat trouvé'

            } else {

                const rawData =req.body;
                const arrayRawData = Object.entries(rawData);
                arrayFormatedData = [];
                
                for (let index = 0; index < arrayRawData.length; index++) {
                    arrayFormatedData[arrayRawData[index][0]] = arrayRawData[index][1]
                }

                const lgt = arrayRawData.length/2;

                for (let index = 0; index < lgt; index++) {

                    let food = await Food.findOne({
                        while : {
                            id : arrayFormatedData['dish_food_id_'+index],
                            [Op.or] : {
                                userId : req.user.id,
                                userId : null
                            }
                        }
                    })


                    if (food === undefined) {
                        throw 'Aucun plat trouvé'

                    } else {
                        
                        let dishFood = await DishFood.findOne({where : {

                            dishId : req.params.id,
                            foodId : food.id,
                            /*[Op.or] : {
                                userId : req.user.id,
                                userId : null
                            }*/
                        }}) 

                        if (dishFood === undefined) {

                            throw 'Aucun plat trouvé'

                        } else {

                            ateFood = await AteFood.create({
                                foodId : arrayFormatedData['dish_food_id_'+index],
                                weight : arrayFormatedData['dish_food_weight_'+index],
                                userId : req.user.id
                            })

                        }
                    }
                }
            }

        } catch (error){
            console.log(error.message)
        }
    }

    res.redirect('/nutrition')


})

 module.exports = router
