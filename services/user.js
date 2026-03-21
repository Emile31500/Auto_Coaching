const { User, } = require('../models');
const dotenv = require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY)
const { Op } = require('sequelize');


const generateStripeUser = async (user) => {
    try {
        
        if (!(user instanceof User)) throw new Error('user have to be a User model instance');
        const customer = await stripe.customers.create({
            name:  user.name,
            email: user.email,
        });

        return customer;

    } catch (error) {

        console.log(error.message)
        return false;

    }
}

module.exports = {
  generateStripeUser,
};