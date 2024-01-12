const express = require('express');
const router = express.Router()
const authenticationChecker = require('../middlewares/authenticationChecker');
const parserJson = require('../middlewares/parserJson');
const url = require('url');
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY)
const { User }= require('../models')

router.get('/', authenticationChecker, (req, res) => {

    res.render('../views/home',  { layout: '../views/main' });

})

router.get('/premium', authenticationChecker, async(req, res) => {

    const products = await stripe.products.list({
        limit: 3,
    });

    res.render('../views/rates',  { layout: '../views/main', products: products.data});

})

router.get('/checkout/:id_product', authenticationChecker, async (req, res) => {

    const idProduct = req.params.id_product;

    res.render('../views/checkout',  { layout: '../views/main' , idProduct: idProduct});

})

router.post('/checkout', parserJson, authenticationChecker, async (req, res) => {

    const authToken = req.session.token;
    const idProduct = req.body.idProduct;


    const user = await User.findOne({where: {'authToken': authToken}});

    const customerPromise = await stripe.customers.list({
        email: user.email,
        limit: 1
    })

    const customer = customerPromise.data[0]
    console.log(customer);

    const card = await stripe.customers.retrieveSource(customer.default_source);
    console.log(card);

    /* const pricePromise = await stripe.prices.list({
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
    });*/

    res.render('../views/home',  { layout: '../views/main' });

})


 module.exports = router