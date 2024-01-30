const request = require('supertest');
const { JSDOM } = require('jsdom')
const app = require('../app')
const session = require('supertest-session');
const { Food } = require('../models');

function generateRandomString(length) {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  

const foodTest = describe('Food tests', () => {

    jest.setTimeout(10000);

    const rawData = {
        name : 'New food ' + generateRandomString(5),
        carbohydrate : 5,
        proteine : 5,
        fat : 5,
        trans_fat : 2,
        is_meat: false,
        is_milk: false,
        is_egg: false
    }

    it(' 0 : Should return a 401 error page because not auth', async () => {


        const testSession = session(app)
        const res = await testSession
            .post('/api/admin/food')
            .send(rawData)
            .redirects(1);

        const stringToParse = res.error.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;
        
        const food = Food.findOne({where : rawData});

        expect(food.name).toBeUndefined();
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Erreur : 401');
        expect(DOM.querySelector('p').innerHTML).toBe('Vous devez être authentifié pour accéder à cette page.')
        expect(res.statusCode).toEqual(401);

    });

    it(' 1 : Should return a home page because auth as user ', async () => {


        const testSession = session(app)
        const authenticationRawData = {
            email: 'emile00013+2@gmail.com',
            password: 'P4$$w0rd'
        }

        const authReq = await testSession
            .post('/login')
            .send(authenticationRawData)
            .redirects(1);

        expect(authReq.statusCode).toEqual(200);

        const res = await testSession
            .post('/api/admin/food')
            .send(rawData)
            .redirects(1);

        const stringToParse = res.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;
        
        const food = await Food.findOne({where : rawData});

        expect(res.req.path).toEqual('/');
        expect(food).toEqual(null);
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Welcome to Child Template');
        expect(res.statusCode).toEqual(200);

    });

    it(' 2 : Should create an instance of food', async () => {


        const testSession = session(app)
        const authenticationRawData = {
            email: 'admin@auto-coaching.fr',
            password: 'P4$$w0rd'
        }

        const authReq = await testSession
            .post('/login')
            .send(authenticationRawData)
            .redirects(1);

        expect(authReq.statusCode).toEqual(200);

        const res = await testSession
            .post('/api/admin/food')
            .send(rawData)
            .redirects(1);

        const jsonRes = { 
            name : res._body.data.name,
            carbohydrate : res._body.data.carbohydrate,
            proteine : res._body.data.proteine,
            fat : res._body.data.fat,
            trans_fat : res._body.data.trans_fat,
            is_meat: res._body.data.is_meat,
            is_milk: res._body.data.is_milk,
            is_egg: res._body.data.is_egg
        };
        
        const promise = await Food.findOne({where : rawData});

        const food = { 
            name : promise.name,
            carbohydrate : promise.carbohydrate,
            proteine : promise.proteine,
            fat : promise.fat,
            trans_fat : promise.trans_fat,
            is_meat: promise.is_meat,
            is_milk: promise.is_milk,
            is_egg: promise.is_egg
        };

        expect(food).toEqual(rawData);
        expect(jsonRes).toEqual(rawData);
        expect(res.statusCode).toEqual(201);

    });

    it(' 3 : Should return a 401 error page because not auth', async () => {

        const testSession = session(app)

        const foodSeq = await Food.findOne();

        const res = await testSession
            .patch('/api/admin/food/' + foodSeq.id)
            .send(rawData)
            .redirects(1);

        //console.log(res.text)
        const stringToParse = res.error.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;
        
        const food = await Food.findOne({where : {id : foodSeq.id}});

        expect(food.name).toEqual(foodSeq.name);
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Erreur : 401');
        expect(DOM.querySelector('p').innerHTML).toBe('Vous devez être authentifié pour accéder à cette page.')
        expect(res.statusCode).toEqual(401);

    });

    it(' 4 : Should return the home page', async () => {


        const testSession = session(app)
        const authenticationRawData = {
            email: 'emile00013+2@gmail.com',
            password: 'P4$$w0rd'
        }

        const authReq = await testSession
            .post('/login')
            .send(authenticationRawData)
            .redirects(1);

        expect(authReq.statusCode).toEqual(200);

        const foods = await Food.findAll({limits: 1});
        const foodSeq = foods[0];
        const foodBeforeUpdate = foodSeq

        const res = await testSession
            .patch('/api/admin/food/' + foodSeq.id)
            .send({name : "New food name" + generateRandomString(5)})
            .redirects(1);

        const stringToParse = res.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;

        expect(res.req.path).toEqual('/');
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Welcome to Child Template');
        expect(authReq.statusCode).toEqual(200);
        expect(foodBeforeUpdate.name).toEqual(foodSeq.name);


    });

    it(' 5 : Should update this food', async () => {


        const testSession = session(app)
        const authenticationRawData = {
            email: 'admin@auto-coaching.fr',
            password: 'P4$$w0rd'
        }

        const authReq = await testSession
            .post('/login')
            .send(authenticationRawData)
            .redirects(1);

        expect(authReq.statusCode).toEqual(200);

        const foods = await Food.findAll({limits: 1});
        const foodSeq = foods[0];

        const res = await testSession
            .patch('/api/admin/food/' + foodSeq.id)
            .send({name : "New food name" + generateRandomString(5)})
            .redirects(1);

        const foodApi = res._body.data;

        expect(foodApi.name).not.toEqual(foodSeq.name);
        expect(res.statusCode).toEqual(202);

    });

    it(" 6 : Sould not allow deletion of this food, redirect to home page and print a 401 error", async () => {

        const testSession = session(app)
    
        const food = await Food.findOne({where : rawData});
        
        const res = await testSession
            .delete('/api/admin/food/' + food.id)
            .redirects(1);

        const stringToParse = res.error.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;

        const deletedFood = await Food.findOne({where : {id: food.id}});

        expect(res.req.path).toEqual('/');
        expect(deletedFood).toEqual(food);
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Erreur : 401');
        expect(DOM.querySelector('p').innerHTML).toBe('Vous devez être authentifié pour accéder à cette page.')
        expect(res.statusCode).toEqual(401);
        

    });

    it(" 7 : Sould not allow deletion of this food and redirect to home page", async () => {

        const testSession = session(app)

        const authReq = await testSession
            .post('/login')
            .send({email: 'emile00013+2@gmail.com', password: 'P4$$w0rd'})
            .redirects(1);

        expect(authReq.statusCode).toEqual(200);

        const food = await Food.findOne({where : rawData});
        
        const res = await testSession
            .delete('/api/admin/food/' + food.id)
            .redirects(1);

        const deletedFood = await Food.findOne({where : {id: food.id}});

        expect(res.req.path).toEqual('/');
        expect(deletedFood).toEqual(food);
        

    });

    it(" 8 :Sould delete this food", async () => {

        const testSession = session(app)

        const authReq = await testSession
            .post('/login')
            .send({email: 'admin@auto-coaching.fr', password: 'P4$$w0rd'})
            .redirects(1);

        expect(authReq.statusCode).toEqual(200);
        const food = await Food.findOne({where : rawData});
        
        const res = await testSession
            .delete('/api/admin/food/' + food.id)
            .redirects(1);

        const deletedFood = await Food.findOne({where : {id: food.id}});

        expect(res.statusCode).toEqual(204);
        expect(deletedFood).toEqual(null);
        

    });

    it(" 9 : Should return a food instance", async () => {

        const testSession = session(app)

        const authReq = await testSession
            .post('/login')
            .send({email: 'emile00013+2@gmail.com', password: 'P4$$w0rd'})
            .redirects(1);

        expect(authReq.statusCode).toEqual(200);

        const foods = await Food.findAll({limit: 1});
        const foodSeq = foods[0]; 

        const res = await testSession
            .get('/api/food/' + foodSeq.id)
            .redirects(1);

        const foodApi = res._body.data

        expect(res.statusCode).toEqual(200);
        expect(res._body.code).toEqual(200);
        expect(foodApi.id).toEqual(foodSeq.id);
        expect(foodApi.name).toEqual(foodSeq.name);

    });

});

module.exports = foodTest;
