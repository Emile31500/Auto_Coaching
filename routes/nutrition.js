const express = require('express');
const {Food} = require('../models/');

const router = express.Router()

router.get('/nutrition', async (req, res) => {
    
    var food = await Food.findAll();
    res.render('../views/nutrition',  { food: food, layout: '../views/main' });

})

 module.exports = router