const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router()
const isAuth = require('../middlewares/isAuth')

router.get('/', isAuth, (req, res) => {

    res.render('../views/home',  { 
        page : '/',
        user : req.user, 
        layout: '../views/main' 
    });

})

 module.exports = router;
