const express = require('express');
const jwt = require('jsonwebtoken');
const { User, NutritionRequirement } = require('../models')
const { Op } = require('sequelize')
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY)
const router = express.Router()
const isAuth = require('../middlewares/isAuth');
const parserJson = require('../middlewares/parserJson');
const pbkdf2 = require("hash-password-pbkdf2")

router.get('/cgv', isAuth, async (req, res) => {

    res.render('../views/cgv',  { 
        user : req.user, 
        page : '/cgv',
        layout: '../views/main' 
    });
});

router.post("/create-subscription", async (req, res) => {
  try {
    const { email, paymentMethodId } = req.body;

    console.log(paymentMethodId)

    // 1️⃣ Créer le client
    const customer = await stripe.customers.create({
      email: email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // 2️⃣ Créer l'abonnement
    const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: 'price_1T1p2WJ7uGufFKhI58gwnOec'},],
        /*payment_behavior: 'default_incomplete',
        payment_settings: {
            save_default_payment_method: "on_subscription",
        },*/
        expand: ['latest_invoice.payment_intent'],
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret:
        subscription.latest_invoice.payment_intent.client_secret,
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

/*
router.post("/create-payment-intent", parserJson, async (req, res) => {

    try {

        const rawData = req.body;

        const customer = await stripe.customers.create({
            email: rawData.email,
        });


        const setupIntent = await stripe.setupIntents.create({
            customer: customer.id,
        });

         res.status(200).json({
            // subscriptionId: subscription.id,
            clientSecret: setupIntent.client_secret
                // subscription.latest_invoice.payment_intent.client_secret,
        });/**/


        /*if (rawData.password === rawData.passwordConf) {
        
            const isUser = await User.findOne({where : { email : rawData.email}})

            if (!(isUser instanceof User)){
                
                const hashedPassword = pbkdf2.hashSync(rawData.password);
                
                let user = await User.create({
                    name: rawData.name,
                    email: rawData.email,
                    password: hashedPassword,
                    birthDay: rawData.birthDay,
                    sex: rawData.sexe,
                    role: ["user"]
                });
                await user.save()

                const nutritionRequirement = await NutritionRequirement.create({
                    personnalMultiplicator : 1.0,
                    metabolismMultiplicator : 1.0,
                    proteinMultiplicator : 1.0,
                    fatMultiplicator : 1.0,
                    userId : user.id
                })

                const customer = await stripe.customers.create({
                    email: rawData.email,
                    payment_method: rawData.paymentMethodId,
                    invoice_settings: {
                        default_payment_method: rawData.paymentMethodId,
                    },
                });

                const now = new Date();
                const endDate = now;
                endDate.setDate(now.getDate() + 124);

                const subscription = await stripe.subscriptions.create({
                    customer: customer.id,
                    items: [
                        {
                            price: rawData.priceId,
                        },
                    ],
                    cancel_at: Math.floor(endDate.getTime() / 1000),
                    payment_behavior: "default_incomplete",
                    expand: ["latest_invoice.payment_intent"],
                });
                console.log(subscription)

                res.status(200).json({
                    subscriptionId: subscription.id,
                    clientSecret:
                        subscription.latest_invoice.payment_intent.client_secret,
                });


            } else throw 'Un utilisateur avec cette adresse maile existe déjà';

        } else throw 'Les mots de passe ne sont pas identique';


    } catch (error) {

        console.error(error);
        res.status(400).json({ error: error.message });

    }
     

});*/


router.get('/', isAuth, async (req, res) => {


    if (req.user instanceof User) {
        res.redirect('/profile')
    } else {
        
        users = await User.findAll()
        for (let index = 0; index < users.length; index++) {

            if (users[index].role.includes('admin')) users.splice(index, 1);
            
        }

        const numberOfPLace = process.env.NUMBER_OF_PLACE;
        const count = users.length
        
        if (numberOfPLace > 100) {
            disposablePlace = Math.ceil((numberOfPLace - count)/50)*50;
        } else {
            disposablePlace = (numberOfPLace - count);
        }

        res.locals.message = req.flash()
        res.render('../views/index',  { 
            disposablePlace : disposablePlace,
            page : '/',
            user : req.user,
            layout : '../views/main' 
        });
    }

})
/*
router.get('/', isAuth, async (req, res) => {


    if (req.user instanceof User) {
        res.redirect('/profile')
    } else {
        
        users = await User.findAll()
        for (let index = 0; index < users.length; index++) {

            if (users[index].role.includes('admin')) users.splice(index, 1);
            
        }

        const numberOfPLace = process.env.NUMBER_OF_PLACE;
        const count = users.length
        
        if (numberOfPLace > 100) {
            disposablePlace = Math.ceil((numberOfPLace - count)/50)*50;
        } else {
            disposablePlace = (numberOfPLace - count);
        }

        res.locals.message = req.flash()
        res.render('../views/home',  { 
            disposablePlace : disposablePlace,
            page : '/',
            user : req.user, 
            layout: '../views/main' 
        });
    }

})*/

 module.exports = router;
