const request = require('supertest');
const { JSDOM } = require('jsdom');
const app = require('../app');
const session = require('supertest-session');
const { authUser } = require('./test.tools')

const profileTest = describe('Profile test', () => {

  it('Should return a login page', async () => {

    const testSession = await authUser();
    
    const res = await testSession
      .get('/profile')
      .redirects(1);

    const stringToParse = res.text;
    const parsedString =  new JSDOM(stringToParse);
    const DOM = parsedString.window.document;

    expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
    expect(DOM.querySelector('h2').innerHTML).toBe('Profile');
    expect(res.statusCode).toEqual(200);

  });

  it('Should return a login page', async () => {

    const res = await request(app).get('/profile');
    const stringToParse = res.text;

    const parsedString =  new JSDOM(stringToParse);
    const DOM = parsedString.window.document;

    expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
    expect(DOM.querySelector('h2').innerHTML).toBe('Erreur : 401');
    expect(DOM.querySelector('p').innerHTML).toBe('Vous devez être authentifié pour accéder à cette page.');
    expect(DOM.querySelector('.alert')).toBe(null);
    expect(res.statusCode).toEqual(401);

  });

});

module.exports = profileTest
