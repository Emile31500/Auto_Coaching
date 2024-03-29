const { JSDOM } = require('jsdom')
const app = require('../app')
const session = require('supertest-session');
const { AteFood, Food, User } = require('../models');
const { getDate, randomInt, authUser } = require('./test.tools.js');

const AteFoodTest = describe('Ate food tests', () => {
    

    it(' 0 : Should return a 401 error page because not auth', async () => {

        const currentDateTime = getDate();
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

        const currentDateTime = getDate();
        const testSession = await authUser()

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

    it(' 2 : Should return a 401 error beacause user not auth', async () => {

        const currentDateTime = getDate();

        const testSession = session(app)

        const food = await Food.findOne()
        const weight = randomInt()

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

        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuré cette tâche");
        expect(res.req.path).toEqual('/api/food/ate/');
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);


    });

    it(' 3 : Should create a new ate food', async () => {

        const currentDateTime = getDate();

        const testSession = await authUser()

        const user = await User.findOne({where : {email : 'emile00013+2@gmail.com'}});
        const food = await Food.findOne();
        const weight = randomInt()

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

        const currentDateTime = getDate();
        const tomorowDateTime = getDate(1);

        const testSession = session(app)
        const res = await testSession
            .get('/api/food/ate/' + currentDateTime + '/' + tomorowDateTime)
            .redirects(1);

        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuré cette tâche");
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);

    });

    it(' 5 : Should get a list of ate food', async () => {

        const currentDateTime = getDate();
        const tomorowDateTime = getDate(1);

        const testSession = await authUser()

        const user = await User.findOne({where : {email :  'emile00013+2@gmail.com'}});

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
