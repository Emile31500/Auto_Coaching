const { User } = require('../models/');
const session = require('express-session');
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY)

const premiumChecker = async function (req, res, next) {
        
    const authToken = req.session.token;
    // const user = await User.findOne({where: {'authToken': authToken}});
    const user = await User.findOne({where: {id : 1}});
    req.user = user;

    const expireDate = addDaysToDate(user.createdAt)
    const currentDateTime = getCurrentDateTime();

    const customerPromise = await stripe.customers.list({
        email: user.email,
        limit: 1
    })

    let customer = customerPromise.data[0]
    
    const subscriptions = await stripe.subscriptions.list({
        customer: customer.id
    });
    /*console.log(subscriptions)
    console.log(subscriptions.data)
    console.log(subscriptions.data.length)
    console.log(subscriptions.data.length > 0)*/

    let i = 0;  
    subscriptions.data.forEach(async (subscription) => {


        const productId = subscription.items?.data[0]?.plan?.product
        if (typeof productId === "string") {

            const product = await stripe.products.retrieve(productId)

            if (['active', 'canceled', 'unpaid'].includes(subscription.status)) {
                
                console.log(product.id)
                if (product.id === 'prod_TzofT7YP9GVDLx'){

                    console.log('ta femme jai decharge dans la bouche !')
                    req.isPremium = true;
                    next();



                } else {
                    console.log(2)
                    const expireDateSubscripbe = addDaysToDate(subscription.created, product.metadata.days_until_canceled);
                    const expiredDateStamp = new Date(expireDateSubscripbe).getTime()
                    const currentDateStamp = new Date(currentDateTime).getTime()
                    if (currentDateStamp < expiredDateStamp) req.isPremium = true; next();

                }
            }
        }

        i++;

    });

    var timestampA = new Date(expireDate).getTime();
    var timestampB = new Date(currentDateTime).getTime();

    if (timestampB < timestampA) {

        next();

    } else if (req.isPremium === false) {

        res.redirect('/premium');

    }


    function addDaysToDate(inputDate, daysToAdd = 31) {

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