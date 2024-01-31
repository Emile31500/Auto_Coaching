const request = require('supertest');
const { JSDOM } = require('jsdom')
const app = require('../app')
const session = require('supertest-session');
const { AteFood, Food, User } = require('../models');


const AteFoodTest = describe('Food tests', () => {

    function getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    function getTomorowDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()+1).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    
    

    it(' 0 : Should return a 401 error page because not auth', async () => {

        const currentDateTime = getCurrentDateTime();
        const testSession = session(app)
        const res = await testSession
            .get('/food/ate/' + currentDateTime)
            .redirects(1);

        const stringToParse = res.error.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;

        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Erreur : 401');
        expect(DOM.querySelector('p').innerHTML).toBe('Vous devez être authentifié pour accéder à cette page.')
        expect(res.statusCode).toEqual(401);

    });

    it(' 1 : Should return the ate food page', async () => {

        const currentDateTime = getCurrentDateTime();
        const testSession = session(app)

        const reqAuth = await testSession
            .post('/login')
            .send({email : 'emile00013+2@gmail.com', password : 'P4$$w0rd'})
            .redirects(1);

        expect(reqAuth.statusCode).toEqual(200);

        const res = await testSession
            .get('/food/ate/' + currentDateTime)
            .redirects(1);

        const stringToParse = res.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;

        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Détais de la diette de ce jour :');
        expect(DOM.querySelector('h3').innerHTML).toBe(currentDateTime);
        expect(res.statusCode).toEqual(200);

    });

    it(' 2 : Should return a 401 error page beacause user not auth', async () => {

        const currentDateTime = getCurrentDateTime();

        const testSession = session(app)

        const food = await Food.findOne()
        const weight = Math.floor(Math.random() * 100) + 1;

        const raw = {
            foodId : food.id,
            weight : weight,
            createdAt : currentDateTime,
            updatedAt : currentDateTime
        }

        const res = await testSession
            .post('/api/food/ate/')
            .send(raw)
            .redirects(1);

        const seqAteFood = await AteFood.findOne({where : raw});

        const stringToParse = res.error.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;

        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Erreur : 401');
        expect(DOM.querySelector('p').innerHTML).toBe('Vous devez être authentifié pour accéder à cette page.')
        expect(seqAteFood).toEqual(null)
        expect(res.statusCode).toEqual(401);


    });

    it(' 3 : Should create a new ate food', async () => {

        const currentDateTime = getCurrentDateTime();

        const testSession = session(app)

        const reqAuth = await testSession
            .post('/login')
            .send({email : 'emile00013+2@gmail.com', password : 'P4$$w0rd'})
            .redirects(1);

        expect(reqAuth.statusCode).toEqual(200);

        const user = await User.findOne({where : {email : 'emile00013+2@gmail.com'}});
        const food = await Food.findOne();
        const weight = Math.floor(Math.random() * 100) + 1;

        const raw = {
            foodId : food.id,
            weight : weight,
            createdAt : currentDateTime,
            updatedAt : currentDateTime
        }

        const res = await testSession
            .post('/api/food/ate/')
            .send(raw)
            .redirects(1);

        const apiAteFood =  res._body.data;
        const seqAteFood = await AteFood.findOne({where : apiAteFood.id});

        expect(res.statusCode).toEqual(201);
        expect(seqAteFood.id).toEqual(apiAteFood.id);
        expect(seqAteFood.userId).toEqual(apiAteFood.userId);
        expect(seqAteFood.userId).toEqual(user.id);


    });


    it(' 4 : Should return a 401 error page because not auth', async () => {

        const currentDateTime = getCurrentDateTime();
        const tomorowDateTime = getCurrentDateTime();

        const testSession = session(app)
        const res = await testSession
            .get('/api/food/ate/' + currentDateTime + '/' + tomorowDateTime)
            .redirects(1);

        const stringToParse = res.error.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;

        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Erreur : 401');
        expect(DOM.querySelector('p').innerHTML).toBe('Vous devez être authentifié pour accéder à cette page.')
        expect(res.statusCode).toEqual(401);

    });

    it(' 5 : Should get a list of ate food', async () => {

        const currentDateTime = getCurrentDateTime();
        const tomorowDateTime = getTomorowDateTime();

        const testSession = session(app)

        const reqAuth = await testSession
            .post('/login')
            .send({email : 'emile00013+2@gmail.com', password : 'P4$$w0rd'})
            .redirects(1);

        expect(reqAuth.statusCode).toEqual(200);

        const user = await User.findOne({where : {email :  'emile00013+2@gmail.com'}});
        const food = await Food.findOne()
        const weight = Math.floor(Math.random() * 100) + 1;

        const res = await testSession
            .get('/api/food/ate/' + currentDateTime + '/' + tomorowDateTime)
            .redirects(1);

        const ateFoods = res._body.data;
        
        expect(res.statusCode).toEqual(200);

        ateFoods.forEach(ateFood => {
            
            expect(ateFood.userId).toEqual(user.id);

            let updatedAt = Date.parse(ateFood.updatedAt);
            let currentTimesTamp = Date.parse(currentDateTime);
            let tomorowTimesTamp = Date.parse(tomorowDateTime);

            expect(updatedAt < tomorowTimesTamp).toEqual(true);
            expect(updatedAt >= currentTimesTamp).toEqual(true);
            
        });

    });

});

module.exports = AteFoodTest;
