const { User } = require('../models/');
const session = require('express-session');
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY)

const premiumChecker = async function (req, res, next) {
        
    req.isPremium = false;
    const authToken = req.session.token;
    const user = await User.findOne({where: {'authToken': authToken}});

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

    if(subscriptions.data.length > 0){

        for(let i = 0; i > subscriptions.data.length || req.isPremium === false; i++ ){

            if (subscriptions.data[i].status === "active") {

                req.isPremium = true;

            }

        }
    }

    var timestampA = new Date(expireDate).getTime()
    var timestampB = new Date(currentDateTime).getTime()

    if (timestampB < timestampA || req.isPremium) {

        next();

    } else {

        res.statusCode = 401
        res.redirect('/premium?error_message=Trial period has expired. Take a premium to discover new features !');

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