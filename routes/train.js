const express = require('express');

const router = express.Router()

router.get('/train', (req, res) => {
    
    var food = Food.findAll();
    console.log(food);
    res.render('../views/train',  { food: food, layout: '../views/main' });


})

 module.exports = router