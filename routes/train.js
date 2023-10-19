const express = require('express');

const router = express.Router()

router.get('/train', (req, res) => {

    res.render('../views/train',  { food: food, layout: '../views/main' });


})

 module.exports = router