const express = require('express');
const {Food} = require('../models/');

const router = express.Router();
const authenticationChecker = require('../middlewares/authenticationChecker');

router.get('/nutrition', authenticationChecker, async (req, res) => {
    
    var food = await Food.findAll();
    res.render('../views/nutrition',  { food: food, layout: '../views/main' });

})

 module.exports = router