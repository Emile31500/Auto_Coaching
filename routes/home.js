const express = require('express');
const router = express.Router()
const authenticationChecker = require('../middlewares/authenticationChecker');
const premiumChecker = require('../middlewares/premiumChecker');
const parserJson = require('../middlewares/parserJson');
const url = require('url');
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY)
const http = require('http');
const { User }= require('../models');

router.get('/', authenticationChecker, premiumChecker, (req, res) => {

    console.log(req.isPremium);
    res.render('../views/home',  { layout: '../views/main' });

})


 module.exports = router