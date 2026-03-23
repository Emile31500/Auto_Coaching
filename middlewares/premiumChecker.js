const { User } = require('../models/');
const session = require('express-session');
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY)
const jwt = require('jsonwebtoken')


const premiumChecker = async function (req, res, next) {
    try {
        const authToken = req.session.token;
        const decodeToken = jwt.verify(authToken, process.env.JWT_SECRET);
        
        if (!decodeToken) {
            console.log(1)
            throw new Error
        
        }
    
        const user = await User.findOne({where: { email : decodeToken.email}});
        req.user = user;

        if (user.role.includes('admin')) {
            req.isPremium = true;
            next();

        } else {

            const customerPromise = await stripe.customers.list({
                email: user.email,
                limit: 1
            })

            let customer = customerPromise.data[0]
            
            const subscriptions = await stripe.subscriptions.list({
                customer: customer.id
            });


            let i = 0; 
            if (subscriptions.data.length > 0) {

                subscriptions.data.forEach(async (subscription) => {

                    const productId = subscription.items?.data[0]?.plan?.product
                    if (typeof productId === "string") {

                        const product = await stripe.products.retrieve(productId)

                        if (['active', 'canceled', 'unpaid'].includes(subscription.status)) {
                            
                            if (product.id === 'prod_TzofT7YP9GVDLx'){

                                req.isPremium = true;
                                next();

                            } else {
                                
                                const expireDateSubscripbe = addDaysToDate(subscription.created, product.metadata.days_until_canceled);
                                const expiredDateStamp = new Date(expireDateSubscripbe).getTime()
                                const currentDateStamp = new Date(currentDateTime).getTime()
                                if (currentDateStamp < expiredDateStamp) req.isPremium = true; 
                                next();

                            }
                        }
                    }

                    i++;
                });

                console.log(2)
                throw new Error


            } else {
                console.log(3)
                throw new Error

            } 
        }

    } catch (error) {

        console.log('fhbebukvdbnemfnerfb')
        res.redirect('/premium');

    }




    function addDaysToDate(inputDate, daysToAdd) {

        var currentDate = new Date(inputDate);
      
        currentDate.setDate(currentDate.getDate() + daysToAdd);
      
        var year = currentDate.getFullYear();
        var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        var day = currentDate.getDate().toString().padStart(2, '0');
        var hours = currentDate.getHours().toString().padStart(2, '0');
        var minutes = currentDate.getMinutes().toString().padStart(2, '0');
        var seconds = currentDate.getSeconds().toString().padStart(2, '0');
      
        var formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      
        return formattedDate;

    }
      
    function getCurrentDateTime() {

        var currentDate = new Date();
        
        var year = currentDate.getFullYear();
        var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        var day = currentDate.getDate().toString().padStart(2, '0');
        var hours = currentDate.getHours().toString().padStart(2, '0');
        var minutes = currentDate.getMinutes().toString().padStart(2, '0');
        var seconds = currentDate.getSeconds().toString().padStart(2, '0');
        
        var currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        
        return currentDateTime;
    }
}

module.exports = premiumChecker;