const express = require('express');
const router = express.Router()
const authenticationChecker = require('../middlewares/authenticationChecker');

router.get('/', authenticationChecker, (req, res) => {

    res.render('../views/home',  { layout: '../views/main' });

})

 module.exports = router