const request = require('supertest')
const { JSDOM } = require('jsdom')
const app = require('../app')
const { Train, User, ExerciseTrain } = require('../models')
const { authUser } = require('./test.tools')

const trainTest = describe('Trains tests', () => {

    jest.setTimeout(5000);

    it(' 0 :Should return the train main page', async () => {

        const testSession = await authUser();

        const res = await testSession
            .get('/train')
            .redirects(1);

        const stringToParse = res.text;
    
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;
    
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Train');
        expect(res.statusCode).toEqual(200);
    
    });

    it(' 1 : Should return a 401 page', async () => {

        const res = await request(app).get('/train');
        const stringToParse = res.text;
    
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;
    
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Erreur : 401');
        expect(DOM.querySelector('p').innerHTML).toBe('Vous devez être authentifié pour accéder à cette page.')
        expect(res.statusCode).toEqual(401);
    
    });

    it(' 2 : Should return a 401 page becaus user isn\'t auth', async () => {

        const res = await request(app).get('/train');
        const stringToParse = res.text;
    
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;
    
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Erreur : 401');
        expect(DOM.querySelector('p').innerHTML).toBe('Vous devez être authentifié pour accéder à cette page.')
        expect(res.statusCode).toEqual(401);
    
    });

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

});

module.exports = trainTest
