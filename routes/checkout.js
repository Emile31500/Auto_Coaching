const express = require('express');
const router = express.Router()
const authenticationChecker = require('../middlewares/authenticationChecker');
const parserJson = require('../middlewares/parserJson');
const url = require('url');
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY)
const { User } = require('../models');

router.get('/premium',  authenticationChecker, async(req, res) => {

     
    const productsList = await stripe.products.list({
        active : true
    });

    const pricesList = await stripe.prices.list({
        active : true
    });
    
    req.flash('warning', 'Votre abonnement a expiré. Prenez-en un nouveau pour continuer à utiliser notre application !')
    res.locals.message = req.flash();
    res.render('../views/premium',  { 
        user : req.user || await  User.findOne({ where : {id : 1}}),
        page : '',
        layout: '../views/main', 
        products: productsList.data, 
        prices: pricesList.data
    });

})

router.post('/premium',  async(req, res) => {

    try {

         const rawData = req.body;

        const customerList = await stripe.customers.list({
            email: req.user.email,
            limit : 1        
        });

        const customer = customerList.data[0]

        const product = await stripe.products.retrieve(rawData.productId);
        const priceId = product.default_price;


        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId},],
            cancel_at: Math.floor(endDate.getTime() / 1000),
            expand: ['latest_invoice.payment_intent'],
        });

        res.status(200).json({
            subscriptionId: subscription.id,
            /*clientSecret:
                subscription.latest_invoice?.payment_intent?.client_secret?null,*/
        });

    
    } catch (error) {
    
        console.error(error);
        res.status(400).json({ error: error.message });
    
    }
})


router.get('/checkout/:id_product', authenticationChecker, async (req, res) => {

    const idProduct = req.params.id_product;

    res.render('../views/checkout',  { 
        page : '',
        layout: '../views/main' ,
        idProduct: idProduct
    });

})

router.post('/api/checkout', parserJson, authenticationChecker, async (req, res) => {

    const idProduct = req.body.idProduct;


    const customerPromise = await stripe.customers.list({
        email: req.user.email,
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