const express = require('express');
const dotenv = require('dotenv').config();

const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY)


var layout = require('express-ejs-layouts');
const { User } = require('../models');
const pbkdf2 = require("hash-password-pbkdf2")
const url = require('url');

const getStripeCustomer = require('../middlewares/getStripeCustomer')
const premiumChecker = require('../middlewares/premiumChecker');
const parserJson = require('../middlewares/parserJson');
const authenticationChecker = require('../middlewares/authenticationChecker');
const adminChecker = require('../middlewares/adminChecker')

router.get('/profile', authenticationChecker, getStripeCustomer, premiumChecker, async (req, res) => {

    const user = req.user;

    let subscriptions;
    const subscriptionsPromise = await stripe.subscriptions.list({
        customer: req.stripeCustomer.id
    });

    if (subscriptionsPromise.data.length > 0) {

        subscriptions = subscriptionsPromise.data;

    }
    
    res.render('../views/profile',  { user: user, layout: '../views/main', isPremium: req.isPremium, subscriptions: subscriptions });

})


router.get('/login', async function(req, res, next) {

    res.statusCode = 200
    res.render('../views/login',  { error: false, layout: '../views/main' });


});
  
router.get('/signup', function(req, res, next) {

    res.render('../views/signup',  { layout: '../views/main' });

});

router.post('/sign', parserJson, async (req, res) => {

    let data;

    if (data = req.body){

        const hashedPassword = pbkdf2.hashSync(data.password);
        
        const user = await User.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: ["user"]
        });

        const customer = await stripe.customers.create({
            name:  data.name,
            email: data.email,
        });

        res.redirect('login');

    } else {

        res.statusCode = 400;
        res.json({"status" : 400});

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

router.patch('/api/users', authenticationChecker, premiumChecker, async (req, res) => {

    let user = req.user;

    if (data = req.body){

        const hashedPassword = pbkdf2.hashSync(data.password);
        
        user.name = data.name;
        user.email = data.email;
        user.password = hashedPassword;

        const authToken = await user.getAuthenticationToken();
        req.session.token = authToken;

        user.save();
        res.statusCode = 201;
        
        res.send({
                    'code':201,
                    'message':'user created',
                    'data': user
                });

    } else {

        res.statusCode = 400;
        res.json({'code': res.statusCode, 'message':'The user couldn\'t be edited', 'data': user});

    }

});

router.post('/login', parserJson, async (req, res, next) => {

    if (req.body){

        user = await User.findOne({where:  {email: req.body.email}});

        if (user) {

            if (pbkdf2.validateSync(req.body.password, user.password)) {

                const authToken = await user.getAuthenticationToken();
                req.session.token = authToken;

                if (user.role.includes('admin')){

                    res.redirect('/admin/train')

                } else {
                    
                    res.redirect('/');

                }
            
            } else {
            
                res.render('../views/login',  { error: true, message: "Incorrect password or login", layout: '../views/main' });
            
            }

        } else {

            res.render('../views/login',  { error: true, message: "Incorrect password or login", layout: '../views/main' });

        }
    }
});
  
 module.exports = router