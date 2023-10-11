const express = require('express');
const router = express.Router()

router.get('/nutrition', (req, res) => {
    
    res.render('../views/nutrition',  { layout: '../views/main' });

})

 module.exports = router