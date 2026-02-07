const express = require('express');
const { AteFood, User, Food } = require('../models');
var parserJson = require('../middlewares/parserJson');
var authenticationChecker = require('../middlewares/authenticationChecker')
var authenticationCheckerApi = require('../middlewares/authenticationCheckerApi')
const { Op } = require('sequelize');
const session = require('express-session');
const premiumChecker = require('../middlewares/premiumChecker');
const router = express.Router();

router.get('/food/ate/:date', authenticationChecker, parserJson, premiumChecker, async(req, res, next) => {

    const date = req.params.date;

    const dateStart = date;
    const dateEnd = date.replace('00:00:00', '23:59:59');
    console.log(dateStart)
    console.log(dateEnd)

    let ateFoods = await AteFood.findAll({
                                        include : [User, Food],
                                        where: {
                                            userId: req.user.id,
                                            createdAt: {
                                                [Op.between]: [dateStart, dateEnd],
                                                }
                                        }
                                    });
    console.log(ateFoods[0])



    if(date) {
    
        res.render('../views/food-ate', {date: date, layout: '../views/main', ateFoods : ateFoods});

    } else {

        res.statusCode = 401;
        res.send({"message" : "Missing parameter date"});
    
    }

});

router.delete('/api/food/ate/:id_foodate', authenticationCheckerApi, parserJson, async (req, res, next) => {

    const id_foodate = req.params.id_foodate;


    if (req.body && req.session.token){

        try {

            ateFood = await AteFood.findOne({
                include : [User, Food],
                where: {id: id_foodate}
            })

            if (ateFood.User.id === req.user.id ) {

                ateFood.destroy();
                res.statusCode = 204;
                res.send({code: res.statusCode, message: 'This ate food has been created' , data : ateFood});

            } else {

                throw "This ate food was not found";

            }

        } catch (error) {

            console.log(error)

            res.statusCode = 404;
            res.send({code: res.statusCode, message: error});
    
        }

    } else {

        res.statusCode = 401;
        res.send({code: res.statusCode, message: "data required unprovided"});

    }

})

router.get('/api/food/ate/:start_date/:end_date', authenticationCheckerApi, parserJson, premiumChecker, async(req, res, next) => {

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

router.post('/api/food/ate', authenticationCheckerApi, parserJson, async (req, res, next) => {

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

router.post('/food/ate/:id', authenticationCheckerApi, parserJson, async (req, res, next) => {

    const id = req.params.id;
    const date = req.body.date;

    if (req.body && req.session.token) await updateAteFood(id, req);

    res.redirect('/food/ate/'+date);

})

router.patch('/api/food/ate/:id', authenticationCheckerApi, parserJson, async (req, res, next) => {

    if (req.body && req.session.token){
        
        ateFood = await updateAteFood(id, req)
        
        res.statusCode = 201;
        res.send({code: res.statusCode, message: 'This ate food has been updated' , data : ateFood});

    } else {

        res.statusCode = 401;
        res.send({code: res.statusCode, message: "data required unprovided"});

    }

    
})

async function updateAteFood(id, req) {

    let ateFood = await AteFood.findOne({where : { id : id, userId: req.user.id}})
    await ateFood.update(req.body);
    await ateFood.save();

    return ateFood;

}

module.exports = router