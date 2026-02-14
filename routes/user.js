const express = require('express');
const dotenv = require('dotenv').config();

const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY)


var layout = require('express-ejs-layouts');
const { User, Measurment, NutritionRequirement } = require('../models');
const pbkdf2 = require("hash-password-pbkdf2")
const url = require('url');

const getStripeCustomer = require('../middlewares/getStripeCustomer')
const premiumChecker = require('../middlewares/premiumChecker');
const parserJson = require('../middlewares/parserJson');
const authenticationChecker = require('../middlewares/authenticationChecker');
const authenticationCheckerApi = require('../middlewares/authenticationCheckerApi');
const isAuth = require('../middlewares/isAuth')


const adminChecker = require('../middlewares/adminChecker');
const { Op } = require('sequelize');

router.get('/profile', authenticationChecker, getStripeCustomer, premiumChecker, async (req, res) => {

    const user = req.user;

    let subscriptions;
    const subscriptionsPromise = await stripe.subscriptions.list({
        customer: req.stripeCustomer.id
    });

    if (subscriptionsPromise.data.length > 0) {

        subscriptions = subscriptionsPromise.data;

    }

    const measurments = await Measurment.findAll({
        where : {
            [Op.or] : [
                {userId : req.user.id},
                {userId : null}
            ]
        }
    })
    
    res.render('../views/profile',  { 
        page : '/profile',
        user : user,
        measurments : measurments,
        layout : '../views/main',
        isPremium : req.isPremium,
        subscriptions : subscriptions 
    });

})


router.get('/login', async function(req, res, next) {

    res.statusCode = 200
    res.render('../views/login',  { 
        page : '/login',
        user : req.user, 
        error: false, 
        layout: '../views/main' 
    });

});
  
router.get('/signup', function(req, res, next) {

    res.locals.message = req.flash();
    res.render('../views/signup',  { 
        page : '/signup',
        user : req.user,
        layout: '../views/main' 
    });
});

router.post('/sign', parserJson, async (req, res) => {

    try {


        const rawData = req.body

        console.log(rawData)
        if (rawData.password === rawData.passwordConf) {

            const user = await User.findOne({where : { email : rawData.email}})

            if (!(user instanceof User)){
                const hashedPassword = pbkdf2.hashSync(rawData.password);
        
                let user = await User.create({
                    name: rawData.name,
                    email: rawData.email,
                    password: hashedPassword,
                    role: ["user"]

    
                });

                const nutritionRequirement = await NutritionRequirement.create({
                    personnalMultiplicator : 1.0,
                    metabolismMultiplicator : 1.0,
                    proteinMultiplicator : 1.0,
                    fatMultiplicator : 1.0,
                    userId : user.id
                })
                const customer = await stripe.customers.create({
                    name:  rawData.name,
                    email: rawData.email,
                });

                const authToken = await user.getAuthenticationToken();
                req.session.token = authToken;
                req.flash('success', 'Merci infiniment de nous avoir choisit ! Nous espérons que nous serons à la hauteur de vos attentes ! ')

            } else {
                console.log(1)
                throw 'Un utilisateur avec cette adresse maile existe déjà'
            }

        } else {
            console.log(2)
            throw 'Les mots de passe ne sont pas identique'
        }

        res.redirect('/profile')

    } catch (error){

        req.flash('danger', error)
        res.redirect('/signup')
        
    }
});

router.get('/api/user', adminChecker, parserJson, async (req, res) => {

    const parsedUrl = url.parse(req.url, true);
    const id = parsedUrl.query.id;

    const user = await User.findOne({where: {id: id}});

    if (user) {

        res.statusCode = 200
        res.send({'code': res.statusCode, 'message': 'The user has been found', 'data': user});
        
    } else {

        res.statusCode = 404
        res.send({'code': res.statusCode, 'message': 'The user hasn\'t been found'});
    }

});

router.patch('/api/users', authenticationCheckerApi, premiumChecker, async (req, res) => {

    let user = req.user;
    const unupdatedUser = user;

    if (data = req.body){

        const hashedPassword = pbkdf2.hashSync(data.password);
        
        user.name = data.name;
        user.email = data.email;
        user.password = hashedPassword;

        const authToken = await user.getAuthenticationToken();
        req.session.token = authToken;

        await user.save();
        let savedUser = await User.findOne({where : {id : user.id}});

        if (unupdatedUser !== savedUser) {

            res.statusCode = 204;
            res.send({code: res.statusCode, message : 'user has been succesfully updated'});

        } else {

            res.statusCode = 500;
            res.send({code: res.statusCode, message : 'User update dosn\'t worked'});

        }
        
    } else {

        res.statusCode = 400;
        res.send({code: res.statusCode, message:'The user couldn\'t be edited', data: user});

    }

});

router.post('/login', isAuth, parserJson, async (req, res, next) => {

    if (req.body){

        user = await User.findOne({where:  {email: req.body.email}});

        if (user) {

            if (pbkdf2.validateSync(req.body.password, user.password)) {

                const authToken = await user.getAuthenticationToken();
                req.session.token = authToken;

                if (user.role.includes('admin')){

                    res.redirect('/admin/train')

                } else {
                    res.redirect('/profile');
                }
            
            } else {
            
                res.render('../views/login',  { user : req.user, error: true, message: "Incorrect password or login", layout: '../views/main' });
            
            }

        } else {

            res.render('../views/login',  { user : req.user, error: true, message: "Incorrect password or login", layout: '../views/main' });

        }
    }
});
  
router.get('/logout', async(req, res) => {

    req.session.token = '';

    res.redirect('/');

})

router.get('/api/user/authenticated', isAuth, async(req, res)=>{

    const user = req.user

    if (user) {

        res.statusCode = 200
        res.send({code : res.statusCode, message : 'Authenticcated user has been successfully got', data : user});

    } else {

        res.statusCode = 404
        res.send({code : res.statusCode, message : 'Authenticcated user has been not found'});

    }

});

module.exports = router
