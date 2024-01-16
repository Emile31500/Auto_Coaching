const express = require('express');
const router = express.Router()
const authenticationChecker = require('../middlewares/authenticationChecker');
const parserJson = require('../middlewares/parserJson');
const url = require('url');
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY)
const http = require('http');
const { User }= require('../models');

router.get('/premium', parserJson, authenticationChecker, async(req, res) => {

    const authToken = req.session.token;
    const parsedUrl = url.parse(req.url, true);
    let error_message;

    if (parsedUrl.query.error_message){

        error_message = parsedUrl.query.error_message;
    }
     
    let isPremium = false;

    const user = await User.findOne({where: {'authToken': authToken}});

    const customerPromise = await stripe.customers.list({
        email: user.email,
        limit: 1
    })

    let customer = customerPromise.data[0]

    const subscriptions = await stripe.subscriptions.list({
        customer: customer.id
    });

    if(subscriptions.data.length > 0){

        for(let i = 0; i > subscriptions.data.length || isPremium === false; i++ ){

            if (subscriptions.data[i].status === "active") {

                isPremium = true;

            }
        }
    }

    const products = await stripe.products.list({
        limit: 3,
    });

    res.render('../views/rates',  { layout: '../views/main', products: products.data, errorMessage: error_message});

})

router.get('/checkout/:id_product', authenticationChecker, async (req, res) => {

    const idProduct = req.params.id_product;

    res.render('../views/checkout',  { layout: '../views/main' , idProduct: idProduct});

})

router.post('/api/checkout', parserJson, authenticationChecker, async (req, res) => {

    const authToken = req.session.token;
    const idProduct = req.body.idProduct;

    const user = await User.findOne({where: {'authToken': authToken}});

    const customerPromise = await stripe.customers.list({
        email: user.email,
        limit: 1
    })

    let customer = customerPromise.data[0]

    const tokenId = req.body.token.id
    const customerSource = await stripe.customers.createSource(
        customer.id,
        {
           source: tokenId
        }
    );

    const pricePromise = await stripe.prices.list({
        product : idProduct,
        type : "recurring",
        limit: 1
    });

    const price = pricePromise.data[0];

    const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [
                {
                    price: price.id,
                },
            ],
    });

    if (subscription.id){

        res.statusCode = 201;
        res.send({code: res.statusCode, message: 'Subscription has succesfully be completed', data: subscription});
        
    } else if (subscription.raw.statusCode){

        res.statusCode = subscription.raw.statusCode;
        res.send({code: res.statusCode, message : subscription.raw.message});

    }     

})

router.delete('/api/subscription/:id_subscription', parserJson, authenticationChecker, async (req, res) => {

    const idSubscription = req.params.id_subscription;
    let canCancel = false;

    const subscription = await stripe.subscriptions.retrieve(
        idSubscription
    );

    var currentDate = new Date();
    var integerDate = currentDate.getTime();
    
    console.log(subscription);
    productId = subscription.plan.product;

    if (productId === 'prod_KKjy9S91iB6qYP'){

        const expireDate = subscription.start_date + 86400*6*31;
        if (integerDate > expireDate) canCancel = true;

    } else if (productId === 'prod_KKjw4bAelTBOMa') {

        const expireDate = subscription.start_date + 86400*12*31;
        if (integerDate > expireDate) canCancel = true;

    } else {

        canCancel = true;

    }

    if (canCancel){

        const canceledSubscription = await stripe.subscriptions.cancel(
             idSubscription
        );
       

        if (canceledSubscription.status === 'canceled') {

            res.statusCode = 204
            res.send({code: res.statusCode, message: 'The subscription has been successfully canceled'});

        } else {

            res.statusCode = 500
            res.send({code: res.statusCode, message: 'There was a problem during cancelation.'});

        }
    
    }
});

module.exports = router