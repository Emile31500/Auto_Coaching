const express = require('express');
const { AteFood } = require('../models');
var parserJson = require('../middlewares/parserJson');
var authenticationChecker = require('../middlewares/authenticationChecker')
const { Op } = require('sequelize');
const session = require('express-session');
const http = require('http');
const url = require('url');
const router = express.Router();

router.get('/food/ate', authenticationChecker, parserJson, async(req, res, next) => {

    const parsedUrl = url.parse(req.url, true);

    if(parsedUrl.query.date) {
    
        res.render('../views/food-ate', {date: parsedUrl.query.date, layout: '../views/main'});

    } else {

        res.statusCode = 401;
        res.send({"message" : "Missing parameter date"});
    
    }

})

router.get('/api/food/ate', authenticationChecker, parserJson, async(req, res, next) => {

    const parsedUrl = url.parse(req.url, true);
    const dateStart = parsedUrl.query.date;

    let tempDate = new Date(dateStart);
    let day = ("0" + (tempDate.getDate()+1)).slice(-2);
    let month = ("0" + (tempDate.getMonth()+1)).slice(-2);
    let year = tempDate.getFullYear();
  
    const dateEnd = year + "-" + month + "-" + day + ' 00:00:00';

    let ateFoods = await AteFood.findAll({where : {userId: req.session.token,
            createdAt: {
                [Op.between]: [dateStart, dateEnd],
            }}
        });

    if (ateFoods){
    
        res.statusCode = 200
        res.send(ateFoods);
    
    } else {

        res.statusCode = 404;
        res.send({"message" : "No ate foods found"});

    }

});

module.exports = router