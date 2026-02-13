const express = require('express');
var parserJson = require('../middlewares/parserJson');
var authenticationChecker = require('../middlewares/authenticationChecker');

const { Op } = require('sequelize');
const router = express.Router();
const { AteFood, Dish, DishFood, Food } = require('../models');

router.post('/ate/dish/:id', authenticationChecker, parserJson, async(req, res, next) => {

    try {

        if (req.body && req.session.token) {

            dish = await Dish.findOne({where : {
                id : req.params.id,
                userId : req.user.id
            }}) 

            if (dish  instanceof Dish) {

                const rawData =req.body;
                const arrayRawData = Object.entries(rawData);
                arrayFormatedData = [];
                
                for (let index = 0; index < arrayRawData.length; index++)  arrayFormatedData[arrayRawData[index][0]] = arrayRawData[index][1];

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

                    if (food instanceof Food) {

                        let dishFood = await DishFood.findOne({where : {

                            dishId : req.params.id,
                            foodId : food.id,
                            /*[Op.or] : {
                                userId : req.user.id,
                                userId : null
                            }*/
                        }}) 


                        if (dishFood instanceof DishFood) {

                            ateFood = await AteFood.create({
                                foodId : arrayFormatedData['dish_food_id_'+index],
                                weight : arrayFormatedData['dish_food_weight_'+index],
                                userId : req.user.id,
                                date : rawData.date
                            })

                        } else { console.log(111111); throw 'Aucun plat trouvé'}
                        
                    } else { console.log(222222); throw 'Aucun plat trouvé'}
                }

                req.flash('success', 'Le plat a bien été mis à jour.')

            } else {
                console.log(3333333); throw 'Aucun plat trouvé'
            }
        }

    } catch (error){

        req.flash('danger', error)
        
    }

    const date = new Date()
    res.redirect('/nutrition/'+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate());


})

 module.exports = router
