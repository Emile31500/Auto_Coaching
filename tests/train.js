// const request = require('supertest')
const session = require('supertest-session');
const cheerio = require("cheerio");
const app = require('../app')
const { authPremiumUser, authNonPremiumUser } = require('./test.tools');
const trainTest = describe('Trains tests', () => {

    jest.setTimeout(5000);

    it(' 0.1 : train page auth premium user : should return the train page', async () => {

        const [testSession, user] = await authPremiumUser();

        const res = await testSession
            .get('/train')
            .redirects(1);

        const $ = cheerio.load(res.text);
    
        expect($('h2').html()).toMatch('Nos programmes');
        expect(res.statusCode).toEqual(200);
        expect(res.req.path).toEqual('/train');

    
    });

    it(' 0.2 : train page auth non premium user : should return the premium page', async () => {

        const [testSession, user] = await authNonPremiumUser();

        const res = await testSession
            .get('/train')
            .redirects(1);

        const $ = cheerio.load(res.text);
    
        expect($('h2').html()).not.toMatch('Nos programmes');
        expect(res.statusCode).toEqual(200);
        expect(res.req.path).toEqual('/premium');
    
    });

    it(' 1 : train page non auth  user : should return the home page', async () => {

        const testSession = session(app);
        
        const res = await testSession.get('/train').redirects(1);
        const $ = cheerio.load(res.text);
    
        expect($('h2').html()).not.toMatch('Nos programmes');
        expect(res.statusCode).toEqual(200);
        expect(res.req.path).toEqual('/');
    
    });

   

/*
    it(' 3 : Should return a 401 page because user is no auth', async () => {

        const train = await Train.findOne({where : {isFinished : true}});

        const url = '/train/' + train.id;
        const res = await request(app).get(url);

        const stringToParse = res.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;

        expect(res.req.path).toBe(url)
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Erreur : 401');
        expect(DOM.querySelector('p').innerHTML).toBe('Vous devez être authentifié pour accéder à cette page.')
        expect(res.statusCode).toEqual(401);
    
    });

    it(' 4 : Should return a 401 error because train don\'t belong to user ', async () => {

        const user = await User.findOne({where : {id : 48}});

        const testSession = await authUser();
        
        const train = await Train.findOne({where : {isFinished : true, userId : user.id}});

        const url = '/train/' + train.id;
        const res = await testSession.get(url);

        const stringToParse = res.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;

        expect(res.req.path).toBe(url)
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Erreur : 404');
        expect(DOM.querySelector('p').innerHTML).toBe('L\'élément que vous recherchez n\'existe pas.')
        expect(res.statusCode).toEqual(404);
    
    });

    it(' 5 :Should return the train detail page', async () => {

        const testSession = await authUser();

        const user = await User.findOne({where : {email : 'emile00013+2@gmail.com'}}); 
        const train = await Train.findOne({where : {
                isFinished : true, 
                userId : user.id
            }
        });

        const url = '/train/' + train.id;
        const res = await testSession
            .get(url)
            .redirects(1);

        const stringToParse = res.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;

        expect(res.req.path).toBe(url)
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Entraînement');
        expect(DOM.querySelector('h3').innerHTML).toBe(train.name);
        expect(DOM.querySelectorAll('.play-train').length).toBeGreaterThan(0);
        expect(res.statusCode).toEqual(200);
    
    });


    it(' 6 : Should return a 401 page beacuse user no auth', async () => {

        const train = await Train.findOne({where : {isFinished : true}});
        const exerciseTrain = await ExerciseTrain.findOne({where : {trainId : train.id}});
        const day = exerciseTrain.day;

        const url = '/train/' + train.id + '/play/' + day;
        const res = await request(app).get(url);

        const stringToParse = res.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;

        expect(res.req.path).toBe(url)
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Erreur : 401');
        expect(DOM.querySelector('p').innerHTML).toBe('Vous devez être authentifié pour accéder à cette page.')
        expect(res.statusCode).toEqual(401);
    
    });

    it(' 7 : Should return a 401 error because train don\'t belong to user ', async () => {

        const user = await User.findOne({where : {id : 48}});

        const testSession = await authUser();
        
        const train = await Train.findOne({where : {isFinished : true, userId : user.id}});
        const exerciseTrain = await ExerciseTrain.findOne({where : {trainId : train.id}});
        const day = exerciseTrain.day;

        const url = '/train/' + train.id + '/play/' + day;
        const res = await testSession.get(url);

        const stringToParse = res.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;

        expect(res.req.path).toBe(url)
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Erreur : 404');
        expect(DOM.querySelector('p').innerHTML).toBe('L\'élément que vous recherchez n\'existe pas.')
        expect(res.statusCode).toEqual(404);
    
    });

    it(' 8 : Should return the train play page', async () => {

        const testSession = await authUser();

        const user = await User.findOne({where : {email : 'emile00013+2@gmail.com'}}); 
        const train = await Train.findOne({where : {
                isFinished : true, 
                userId : user.id
            }
        });
        const exerciseTrain = await ExerciseTrain.findOne({where : {trainId : train.id}});
        const day = exerciseTrain.day;

        const url = '/train/' + train.id + '/play/' + day;
        const res = await testSession
            .get(url)
            .redirects(1);

        const stringToParse = res.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;

        expect(res.req.path).toBe(url)
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Entraînement');
        expect(DOM.querySelector('h3').innerHTML).toBe(train.name + ' : ' + day);
        expect(DOM.querySelector('#play')).not.toBeNull();
        expect(DOM.querySelector('#next')).not.toBeNull();
        expect(DOM.querySelector('#previous')).not.toBeNull();

        expect(res.statusCode).toEqual(200);
    
    });
*/
});

module.exports = trainTest
