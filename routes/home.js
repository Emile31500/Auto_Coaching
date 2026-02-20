const express = require('express');
const jwt = require('jsonwebtoken');
const { User, NutritionRequirement } = require('../models')
const { Op } = require('sequelize')
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY)
const router = express.Router()
const isAuth = require('../middlewares/isAuth');
const parserJson = require('../middlewares/parserJson');
const pbkdf2 = require("hash-password-pbkdf2")

const nodemailer = require("nodemailer");

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
/*const transporter = nodemailer.createTransport({
  service: "gmail", // Shortcut for Gmail's SMTP settings - see Well-Known Services
  auth: {
    type: "OAuth2",
    user: "emile00013@gmail.com",
    // clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret:  "edsryxgncragwpfc",
    // refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
})*/


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.SMTP_FROM,
    pass: process.env.SMTP_PASS, 
  },
});

// gmail+smtp://:edsryxgncragwpfc@default*/


  


router.get('/bibliography', async (req, res) => {
    res.render('../views/home/bibliography',  { 
        user : req.user, 
        page : '/bibliography',
        layout: '../views/main' 
    });
})

router.get('/contact', async (req, res) => {

    res.locals.message = req.flash();
    res.render('../views/home/contact',  { 
        user : req.user, 
        page : '/contact',
        layout: '../views/main' 
    });
})

router.post('/contact', parserJson, async (req, res) => {


    try {

        const rawData = req.body

        await transporter.sendMail({
            from: rawData.email,
            to: process.env.SMTP_FROM,
            subject: rawData.subject,
            html: `<p>${rawData.content}</p> <p>Répondre à <a href='mailto:${rawData.email}'>${rawData.firstname}</a></p>`, // Plain-text version of the message
        });

        const today = new Date();

            await transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: rawData.email,
                subject: rawData.objet,
                html: `<p>Bonjour ${rawData.firstname} ${rawData.lastname},</p><p> Votre message ayant pour objet ${rawData.objet} envoyé le ${today.toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }) } a bien été reçu par l'équipe de regimesenior.fr<br>Nous le traiterons dans les plus brefs délais.</p><p>Cordialement</p><p>L'équipe regimesenior</p>`
            });



        req.flash('success', "Votre message a bien été envoyé ! Surveillez l'adresse " )


    } catch(error) {

        req.flash('danger', error.message)

    }

    res.redirect('/contact')
})

router.get('/cgv', isAuth, async (req, res) => {

    res.render('../views/home/cgv',  { 
        user : req.user, 
        page : '/cgv',
        layout: '../views/main' 
    });
});

router.post("/create-subscription", async (req, res) => {

    try {

        const rawData = req.body;

        if (rawData.password === rawData.passwordConf) {
            
            const isUser = await User.findOne({where : { email : rawData.email}})
            const customers = await stripe.customers.list({
                email : rawData.productId
            });


            if (!(isUser instanceof User) || customers.length > 0){

                const customer = await stripe.customers.create({
                    email: rawData.email,
                    payment_method: rawData.paymentMethodId,
                    invoice_settings: {
                        default_payment_method: rawData.paymentMethodId,
                    },
                });

                const product = await stripe.products.retrieve(rawData.productId);
                const priceId = product.default_price;
                    
                const now = new Date();
                const days = Number(product.metadata.days_until_canceled);
                const endDate = new Date(now.getTime() +  (days * 24 * 60 * 60 * 1000))

                const subscription = await stripe.subscriptions.create({
                    customer: customer.id,
                    items: [{ price: priceId},],
                    cancel_at: Math.floor(endDate.getTime() / 1000),
                    expand: ['latest_invoice.payment_intent'],
                });
                
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

                res.status(200).json({
                    subscriptionId: subscription.id,
                    /*clientSecret:
                        subscription.latest_invoice?.payment_intent?.client_secret?null,*/
                });

                  await transporter.sendMail({
                    from: process.env.SMTP_FROM,
                    to: rawData.email,
                    subject: rawData.objet,
                    html: `Bonjour ${rawData.firstname},
                            <p>
                                Nous vous remercions de la confirance que vous nous avez accordé !<br>
                                Vous trouverez ici le récapitulatif de toute vos données pour vous authetifier
                            </p>
                            <p>
                                <ul>
                                    <p>Identifiant : ${rawData.email}</p>
                                    <p>Mot de passe : ${rawData.password}</p>
                                    Lien de connexion <a href="{domain}/login">ici</a>
                                </ul>
                            </p>
                            <p>
                                En vous souhaitant le meilleur dans votre progression
                            </p>
                            <p>
                                <a href="regimesenior.fr">regimesenior.fr</a>
                                <br>
                                8 Rue Blaja,<br>
                                31500 Toulous
                            </p>`
                });


            } else throw 'Un utilisateur avec cette adresse maile existe déjà';

        } else throw 'Les mots de passe ne sont pas identique';

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
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
            layout: '../views/main',
            disposablePlace : disposablePlace,
            page : '/',
            user : req.user, 
        });
    }

})

 module.exports = router;
