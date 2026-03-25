const app = require('../app')
const session = require('supertest-session');
const { User } = require('../models');
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY)

function generateRandomString(length) {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(randomInt(characters.length));
    }
    return result;
}


function getDate(addedDays = 0) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate() + addedDays).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function randomInt( max = 100) {

    return Math.floor(Math.random() * max) + 1

}

async function auth(rawData) {

    const testSession = session(app);

    const res = await testSession
        .post('/login')
        .send(rawData)
        .redirects(1)

    return testSession;
}

async function authPremiumUser() {
    const users = await User.findAll({where : {name: 'FakerUser'}})
    let authUser = undefined;

    for (let index = 0; index < users.length; index++) {
        
        const customers =  await stripe.customers.list({email : users[index].email});
        const subscriptions =  await stripe.subscriptions.list({customer : customers.data[0].id, status : 'active'});

        if (subscriptions.data.length > 0) {
            authUser = users[index]
            index = users.length

            return [
                await auth({
                    email : authUser.email,
                    password : 'testpassword'
                }), 
                authUser
            ];
        }

    }
}

async function authNonPremiumUser() {

    const users = await User.findAll({where : {name: 'FakerUser'}})
    let authUser = undefined;

    for (let index = 0; index < users.length; index++) {
        
        const customers =  await stripe.customers.list({email : users[index].email});

        const subscriptions =  await stripe.subscriptions.list({customer : customers.data[0].id});


        if (subscriptions.data.length <= 0) {
            authUser = users[index]
            index = users.length
        }

    }
    
    
    return [await auth({
        email : authUser.email,
        password : 'testpassword'
    }), authUser];
    
}


async function authUser() {

    const user = await User.findOne({where : {name: 'FakerUser'}})

    return auth({
        email : user.email,
        password : 'testpassword'
    });
}

async function authAdmin() {

    const userAdmin = await User.findOne({where : {name: 'FakerUserAdmin'}})

    return auth({
        email : userAdmin.email,
        password : 'testpassword'
    });
}

async function createRandomUser() {

    const rawData = {
        username : 'User ' + generateRandomString(5),
        email : generateRandomString(5) + '@' + generateRandomString(5) + '.' + generateRandomString(2),
        password : generateRandomString(20)
    }

    const sessionTest = session(app)

    const res = await sessionTest
        .post('/sign')
        .send(rawData)
        .redirects(1)
    
    return rawData

}

module.exports = {
    auth,
    authAdmin,
    authUser,
    authPremiumUser,
    authNonPremiumUser,
    createRandomUser,
    generateRandomString,
    getDate,
    randomInt,
};
