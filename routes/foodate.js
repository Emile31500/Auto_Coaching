const express = require('express');
const { AteFood } = require('../models');
var parserJson = require('../middlewares/parserJson');
var authenticationChecker = require('../middlewares/authenticationChecker')
const { Op } = require('sequelize');
const session = require('express-session');
// const http = require('http');
// const url = require('url');
const premiumChecker = require('../middlewares/premiumChecker');
const router = express.Router();

router.get('/food/ate/:date', authenticationChecker, parserJson, premiumChecker, async(req, res, next) => {

    const date = req.params.date;

    if(date) {

        // var stringDate = new Date(date);
        // stringDate = stringDate.toISOString().replace(/T/, ' ').replace(/\..+/, ''); 
    
        res.render('../views/food-ate', {date: date, layout: '../views/main'});

    } else {

        res.statusCode = 401;
        res.send({"message" : "Missing parameter date"});
    
    }

});

router.get('/api/food/ate/:start_date/:end_date', authenticationChecker, parserJson, premiumChecker, async(req, res, next) => {

    const dateStart = req.params.start_date;
    const dateEnd = req.params.end_date;

    let food = await AteFood.findAll({
                                        where: {
                                            userId: req.user.id,
                                            createdAt: {
                                                [Op.between]: [dateStart, dateEnd],
                                                }
                                        }
                                    });

    if (food){

        res.statusCode = 200;
        res.send({'code': res.statusCode, 'message': 'food elements successfully requested', 'data': food});

    } else {

        res.statusCode = 404
        res.send({'code': res.statusCode, 'message' : 'Ate Food not found'});
    } 
    
});


router.post('/api/food/ate', authenticationChecker, parserJson, async (req, res, next) => {

    if (req.body && req.session.token){

        req.body.userId = req.user.id;
        ateFood = await AteFood.create(req.body);
        
        res.statusCode = 201;
        res.send({code: res.statusCode, message: 'This ate food has been created' , data : ateFood});

    } else {

        res.statusCode = 401;
        res.send({code: res.statusCode, message: "data required unprovided"});

    }

})

// router.get('/api/food/ate', authenticationChecker, parserJson, premiumChecker, async(req, res, next) => {

//     const parsedUrl = url.parse(req.url, true);
//     const dateStart = parsedUrl.query.date;

//     let tempDate = new Date(dateStart);
//     let day = ("0" + (tempDate.getDate()+1)).slice(-2);
//     let month = ("0" + (tempDate.getMonth()+1)).slice(-2);
//     let year = tempDate.getFullYear();
  
//     const dateEnd = year + "-" + month + "-" + day + ' 00:00:00';

//     let ateFoods = await AteFood.findAll({where : {userId: req.session.token,
//             createdAt: {
//                 [Op.between]: [dateStart, dateEnd],
//             }}
//         });

//     if (ateFoods){
    
//         res.statusCode = 200
//         res.send(ateFoods);
    
//     } else {

//         res.statusCode = 404;
//         res.send({"message" : "No ate foods found"});

//     }

// });

module.exports = router