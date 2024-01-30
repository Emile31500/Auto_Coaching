const request = require('supertest')
const { JSDOM } = require('jsdom')
const app = require('../app')
const session = require('supertest-session');

const trainTest = describe('Trains tests', () => {

    it('Should return the train main page', async () => {

        const testSession = session(app)

        const authReq = await testSession
          .post('/login')
          .send({email: 'emile00013+2@gmail.com', password: 'P4$$w0rd'})
          .redirects(1);
        
        expect(authReq.statusCode).toBe(200)

        const res = await testSession
            .get('/train');
        const stringToParse = res.text;
    
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;
    
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Train');
        expect(res.statusCode).toEqual(200);
    
    });

    it('Should return a 401 page', async () => {

        const res = await request(app).get('/train');
        const stringToParse = res.text;
    
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;
    
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Erreur : 401');
        expect(DOM.querySelector('p').innerHTML).toBe('Vous devez être authentifié pour accéder à cette page.')
        expect(res.statusCode).toEqual(401);
    
    });

});

module.exports = trainTest