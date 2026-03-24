const { User } = require('../models/');
const session = require('express-session');
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY)
const jwt = require('jsonwebtoken')


const premiumChecker = async function (req, res, next) {
    let isPremium = false;
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
            isPremium = true;

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

               subscriptions.data.forEach((subscription) => {

                    const productId = subscription.items?.data[0]?.plan?.product

                    if (typeof productId === "string") {

                        const product = stripe.products.retrieve(productId)

                        // console.log(['active'].includes(subscription.status))

                        if (['active'].includes(subscription.status)) {

                            isPremium = true
                            
                            /*if (product.id === 'prod_TzofT7YP9GVDLx'){

                                isPremium = true;
                                console.log('its premium')

                            } else {
                                
                                const expireDateSubscripbe = addDaysToDate(subscription.created, product.metadata.days_until_canceled);
                                const currentDateTime = getCurrentDateTime()
                                const expiredDateStamp = new Date(expireDateSubscripbe).getTime()
                                const currentDateStamp = new Date(currentDateTime).getTime()
                                if (currentDateStamp < expiredDateStamp) {
                                    isPremium = true; 
                                }

                            }*/
                        } else if  (['active', 'canceled', 'unpaid'].includes(subscription.status)) {

                            if (product.id === 'prod_TzofT7YP9GVDLx')isPremium = true;

                        }



                    } else {
                        throw new Error('Aucun produit trouvé attaché à votre abonnement. Contactez nous pour régler ce problème au plus vite.')
                    }

                });
            }
        }

        req.isPremium = isPremium;
        console.log(isPremium);

        if (isPremium) {
            next();
        } else {
            res.redirect('/premium');
        }

    } catch (error) {

        req.flash('danger', error.message)
        res.locals.message = req.flash()
        res.redirect('/');

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