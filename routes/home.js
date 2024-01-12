const express = require('express');
const router = express.Router()
const authenticationChecker = require('../middlewares/authenticationChecker');
const parserJson = require('../middlewares/parserJson');
const url = require('url');
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY)
const http = require('http');
const { User }= require('../models');

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

    let customer = customerPromise.data[0]
    console.log('\n Customer : \n');
    console.log(customer)
    
    ///////////////////////////////////////////////////////////////
    // S'IL N'A PAS DE SOURCE, CREER UNE CARTE AVEC CETTE SOURCE //

    console.log('\n Card : \n');
    const tokenId = req.body.token.id
    const customerSource = await stripe.customers.createSource(
        customer.id,
        {
           source: tokenId
        }
    );

    console.log(customerSource)


    // const tokenJson = req.body.token
    // const token = await stripe.tokens.create({tokenJson});

    // console.log(token)

    ///////////////////////////////////////////////////////////////

       /* if (customer.default_source !== null){

            // const option = {
            //     method: 'GET',
            //     headers: {
            //         'Authorization' : 'Bearer '+process.env.STRIPE_API_SECRET_KEY
            //     }
            // };

            // const url = 'https://api.stripe.com/v1/customers/'+customer.id+'/cards/'+customer.default_source;
            
            // fetch(url, option)
            // .then(response => response.json())
            // .then(card => {
                
            //     console.log(card);
            //     return card;

            // });
            console.log('This cus has a card')

        } else {

            console.log('b');

            const cardNumber = parseInt(req.body.number.replace(' ', ''));

            console.log('Méthode de paiement : ');
            const paymentMethod = await stripe.paymentMethods.create({
                type: 'card',
                card: {
                    exp_month: req.body.exp_month,
                    exp_year: req.body.exp_year,
                    // number: cardNumber,
                    cvc: req.body.cvc,
                },
            });
            console.log(paymentMethod)

            // const customerSource = await stripe.customers.createSource(card.id, {

            //     last4: paymentMethod,
            //     source: {
            //         exp_month: req.body.exp_month,
            //         exp_year: req.body.exp_year,
            //         cvc: req.body.cvc,
            //         object: 'card'
            //     }
            // });
            // await stripe.customers.update(
            //     customer.id,
            //     {
            //         default_source: customerSource.id
            //     }
            // );

        }*/


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

    console.log('\n Subscription : \n');
    console.log(subscription)
    
    res.render('../views/home',  { layout: '../views/main' });

})


 module.exports = router