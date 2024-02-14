const express = require('express');
const { Food, NutritionRequirement } = require('../models/');

const router = express.Router();
const authenticationChecker = require('../middlewares/authenticationChecker');
const adminChecker = require('../middlewares/adminChecker');
const premiumChecker = require('../middlewares/premiumChecker');


router.get('/nutrition', authenticationChecker, premiumChecker, async (req, res) => {
    
    var food = await Food.findAll();
    res.render('../views/nutrition',  { food: food, layout: '../views/main' });

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