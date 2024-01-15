const express = require('express');
const router = express.Router()
const authenticationChecker = require('../middlewares/authenticationChecker');
const parserJson = require('../middlewares/parserJson');
const url = require('url');
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY)
const http = require('http');
const { User }= require('../models');

router.get('/premium', parserJson, authenticationChecker, async(req, res) => {

    console.log(req.body)
    const products = await stripe.products.list({
        limit: 3,
    });

    res.render('../views/rates',  { layout: '../views/main', products: products.data, alert: req.body.alert});

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

    console.log(subscription)

    if (subscription.id){

        res.statusCode = 201;
        res.send({code: res.statusCode, message: 'Subscription has succesfully be completed', data: subscription});
        
    } else if (subscription.raw.statusCode){

        res.statusCode = subscription.raw.statusCode;
        res.send({code: res.statusCode, message : subscription.raw.message});

    }     

})

module.exports = router