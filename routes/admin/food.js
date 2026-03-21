const express = require('express');
const { Food } = require('../../models');

var parserJson = require('../../middlewares/parserJson');

const adminChecker = require('../../middlewares/adminChecker');
const adminCheckerApi = require('../../middlewares/adminCheckerApi');

const router = express.Router();

router.post('/food', parserJson, adminChecker, async (req, res, next) => {


    try {

        if (req.body && req.session.token){

            const rawData = req.body
            const food = Food.create(rawData);
            food.is_veggie = !rawData.is_meat && !rawData.is_milk && !rawData.is_egg;
            req.flash('success', `L'aliment ${food.name} a bien été ajouté`)
         
        }



    } catch (error){

        req.flash('danger', error.message)

    }

    res.redirect('/admin/nutrition')
    
});

 module.exports = router
