const app = require('../app')
const session = require('supertest-session');
const { User } = require('../models');


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

async function authUser() {

    return auth({
        email : 'emile00013+2@gmail.com',
        password : 'P4$$w0rd'
    });
}

async function authAdmin() {

    return auth({
        email : 'admin@auto-coaching.fr',
        password : 'P4$$w0rd'
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
    createRandomUser,
    generateRandomString,
    getDate,
    randomInt,
};
