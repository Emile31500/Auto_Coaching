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

    it('Should return a 401 error page because not auth', async () => {


        const testSession = session(app)

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

        const res = await testSession
            .post('/api/food')
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

    it('Should return a 401 error page because not auth', async () => {


        const testSession = session(app)

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
            .post('/api/food')
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

});

module.exports = foodTest;
