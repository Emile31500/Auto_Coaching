const { User } = require('../models/');
const session = require('express-session');
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY)

const getStripeCustomer = async function (req, res, next) {
        
    const authToken = req.session.token;
    const user = await User.findOne({where: {'authToken': authToken}});

    const customerPromise = await stripe.customers.list({
        email: user.email,
        limit: 1
    })

    let customer = customerPromise.data[0]
    
    req.stripeCustomer = customer;

    next();
}

module.exports = getStripeCustomer;