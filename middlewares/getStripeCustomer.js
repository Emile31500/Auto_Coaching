const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY)

const getStripeCustomer = async function (req, res, next) {

    const customerPromise = await stripe.customers.list({
        email: req.user.email,
        limit: 1
    })

    let customer = customerPromise.data[0]
    
    req.stripeCustomer = customer;

    next();
}

module.exports = getStripeCustomer;