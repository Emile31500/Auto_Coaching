const express = require('express');
const {Food} = require('../models/');

const router = express.Router();
const authenticationChecker = require('../middlewares/authenticationChecker');
const adminChecker = require('../middlewares/adminChecker');
const premiumChecker = require('../middlewares/premiumChecker');


router.get('/nutrition', authenticationChecker, premiumChecker, async (req, res) => {
    
    var food = await Food.findAll();
    res.render('../views/nutrition',  { food: food, layout: '../views/main' });

})

router.get('/admin/nutrition', adminChecker, async (req, res) => {
    
    var food = await Food.findAll();
    res.render('../views/admin/nutrition',  { food: food, layout: '../views/main-admin' });

})

 module.exports = router