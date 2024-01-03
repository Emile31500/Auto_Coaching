const express = require('express');
const {Food} = require('../models/');

const router = express.Router();
const authenticationChecker = require('../middlewares/authenticationChecker');
const adminChecker = require('../middlewares/adminChecker');


router.get('/nutrition', authenticationChecker, async (req, res) => {
    
    var food = await Food.findAll();
    res.render('../views/nutrition',  { food: food, layout: '../views/main' });

})

router.get('/admin/nutrition', adminChecker, async (req, res) => {
    
    var food = await Food.findAll();
    res.render('../views/admin/nutrition',  { food: food, layout: '../views/main-admin' });

})

 module.exports = router