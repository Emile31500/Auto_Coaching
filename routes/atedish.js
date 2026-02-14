const express = require('express');
var parserJson = require('../middlewares/parserJson');
var authenticationChecker = require('../middlewares/authenticationChecker');

const { Op } = require('sequelize');
const router = express.Router();
const { AteFood, Dish, DishFood, Food } = require('../models');

router.post('/ate/dish/:id', authenticationChecker, parserJson, async(req, res, next) => {

    try {
        let foodId;
        if (req.body && req.session.token) {

            dish = await Dish.findOne({where : {
                id : req.params.id,
                userId : req.user.id
            }}) 

            if (dish instanceof Dish) {

                const rawData =req.body;
                const arrayRawData = Object.entries(rawData);
                arrayFormatedData = [];
                
                for (let index = 0; index < arrayRawData.length; index++)  arrayFormatedData[arrayRawData[index][0]] = arrayRawData[index][1];

                const lgt = arrayRawData.length/2-1;

                for (let index = 0; index < lgt; index++) {

                    foodId = arrayFormatedData['dish_food_id_'+(index).toString()];
                    food = await Food.findOne({
                        while : {
                            id : foodId,
                            [Op.or] : [
                                {userId : req.user.id},
                                {userId : null}
                            ]
                        }
                    })

                    if (food instanceof Food) {

                        let dishFood = await DishFood.findOne({where : {
                            dishId : req.params.id,
                            foodId : foodId
                        }}) 

                        if (dishFood instanceof DishFood) {

                            ateFood = await AteFood.create({
                                foodId : foodId,
                                weight : (arrayFormatedData['dish_food_weight_'+(index).toString()]),
                                userId : req.user.id,
                                date : rawData.date
                            })

                        } else {
                            throw 'Cet aliment ne fait pas partie du plat'
                        }
                        
                    } else { 
                        throw 'Aliment non trouvé'
                    }
                }

                req.flash('success', 'Le plat a bien été mis à jour.')

            } else {
                throw 'Aucun plat trouvé'
            }
        }

    } catch (error){

        req.flash('danger', error)
        
    }

    const date = new Date()
    res.redirect('/nutrition/'+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate());


})

 module.exports = router
