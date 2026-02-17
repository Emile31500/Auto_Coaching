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


router.post("/create-payment-intent", parserJson, async (req, res) => {

    try {

        const rawData = req.body;
        console.log(rawData)

        if (rawData.password === rawData.passwordConf) {
        
            const isUser = await User.findOne({where : { email : rawData.email}})
            console.log(isUser)

        
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
                console.log(user)

                const nutritionRequirement = await NutritionRequirement.create({
                    personnalMultiplicator : 1.0,
                    metabolismMultiplicator : 1.0,
                    proteinMultiplicator : 1.0,
                    fatMultiplicator : 1.0,
                    userId : user.id
                })
                console.log(nutritionRequirement instanceof NutritionRequirement)

                const customer = await stripe.customers.create({
                    email: rawData.email,
                    payment_method: rawData.paymentMethodId,
                    invoice_settings: {
                        default_payment_method: rawData.paymentMethodId,
                    },
                });
                console.log(customer)

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
                    ended_at : endDate.getTime(),
                    // status: "active",
                    payment_behavior: "default_incomplete",
                    expand: ["latest_invoice.payment_intent"],
                });/**/

                const authToken = await user.getAuthenticationToken();
                req.session.token = authToken;

                req.flash('success', 'Merci infiniment de nous avoir choisit ! Nous espérons que nous serons à la hauteur de vos attentes ! ')
                res.redirect('/profile')

            } else throw 'Un utilisateur avec cette adresse maile existe déjà';

        } else throw 'Les mots de passe ne sont pas identique';


    } catch (error) {

        req.flash('danger', error);
        res.redirect('/')

    }
     

});

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

})

 module.exports = router;
