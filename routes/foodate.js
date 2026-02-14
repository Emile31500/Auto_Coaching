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

    let ateFoods = await AteFood.findAll({
        include : [User, Food],
        where: {
            userId: req.user.id,
            date: date
        }
    });


    if(date) {

        res.locals.message = req.flash();
        res.render('../views/food-ate', {
            page : '/nutrition',
            date: date,
            layout: '../views/main',
            ateFoods : ateFoods
        });

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
                res.send({code: res.statusCode, message: 'This ate food has been deleted' , data : ateFood});

            } else {

                throw "This ate food was not found";

            }

        } catch (error) {


            res.statusCode = 404;
            res.send({code: res.statusCode, message: error});
    
        }

    } else {

        res.statusCode = 401;
        res.send({code: res.statusCode, message: "data required unprovided"});

    }

})

router.get('/delete/food/ate/:id', authenticationCheckerApi, parserJson, async (req, res, next) => {

    let date;
    try {

        const id = req.params.id

        const ateFood = await AteFood.findOne({
            include : [User, Food],
            where: {id: id}
        })
        date = new Date(ateFood.date);

        const result = deleteAteFood(ateFood, req)
        if (!result) throw "This ate food was not found";
        req.flash('success', 'Cet aliment a bien été supprimé de votre diet')
            

    } catch (error) {
        req.flash('danger', error)
    }

    res.redirect('/food/ate/'+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+' 00:00:00');


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

router.post('/food/ate', authenticationChecker, parserJson, async (req, res, next) => {

    try {

        if (req.body && req.session.token){

            req.body.userId = req.user.id;
            const rawData = req.body
            date = new Date(rawData.date)

            ateFood = await AteFood.create(rawData);
            
            
            req.flash('success', 'Cet aliment a bien été ajouté à la diet du'  + (date.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })))

        } else {

            throw ('soumission du formulaire non valide')

        }

    } catch(error) {

        date = new Date()
        req.flash('danger', error)

    }

    res.redirect('/nutrition/' + date.getFullYear() + "-" + (date.getMonth()+1) + "-" + (date.getDate()));

})

router.post('/food/ate/:id', authenticationCheckerApi, parserJson, async (req, res, next) => {

    const date = req.body.date;

    try {

        if (req.body && req.session.token) {

            const ateFood = await updateAteFood(req.params.id, req);
            req.flash('success', 'L\'aliment : '+ateFood.Food.name+' a bien été mis à jour dans votre diet.')
            
        }

    } catch(error){
        req.flash('danger', error)
    }      

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

    let ateFood = await AteFood.findOne({
        include : Food, 
        where : { 
            id : id,
            userId: req.user.id
        }
    })


    await ateFood.update({weight: req.body.weight});
    await ateFood.save();

    return ateFood;

}

async function deleteAteFood(ateFood, req) {

    if (ateFood.User.id === req.user.id ) {

        ateFood.destroy();
        return true

    } else {
        return false
    }

}

module.exports = router