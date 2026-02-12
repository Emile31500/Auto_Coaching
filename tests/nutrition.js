const request = require('supertest');
const { JSDOM } = require('jsdom')
const app = require('../app')
const { authUser } = require('./test.tools');

const nutritionTest = describe('Nutritions tests', () => {

    it('Should return the nutrition main page', async () => {

        const testSession = await authUser()

        const date = new Date()
        const res = await testSession.get('/nutrition/'+ date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear());

        const stringToParse = res.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;
    
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Nutrition');
        expect(res.statusCode).toEqual(200);
    
    });

    it('Should return a 401 page', async () => {
        
        const date = new Date()
        const res = await request(app).get('/nutrition/'+ date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear());
        const stringToParse = res.text;
    
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;
    
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Erreur : 401');
        expect(DOM.querySelector('p').innerHTML).toBe('Vous devez être authentifié pour accéder à cette page.')
        expect(res.statusCode).toEqual(401);
    
    });

});

module.exports = nutritionTest
