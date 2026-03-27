const request = require('supertest');
const app = require('../app')
const session = require('supertest-session');
const cheerio = require("cheerio");
const { authUser, authPremiumUser, authNonPremiumUser } = require('./test.tools');

const nutritionTest = describe('Nutritions tests', () => {

    it('0.1 : nutrition auth premium : return the nutrition  page', async () => {

        const [testSession, user] = await authPremiumUser()

        const date = new Date()
        const url = '/nutrition/'+ date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear();
        const res = await testSession.get(url).redirects(1);

        const $ = cheerio.load(res.text);
    
        expect($('.h4').html()).toMatch('Total calorique et ');
        expect(res.req.path).toEqual(url);
        expect(res.statusCode).toEqual(200);
    
    });

     it('0.2 : nutrition auth non premium : return the premium page', async () => {

        const [testSession, user] = await authNonPremiumUser()

        const date = new Date()
        const url = '/nutrition/'+ date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear();
        const res = await testSession.get(url).redirects(1);

        const $ = cheerio.load(res.text);
    
        expect(res.req.path).toEqual('/premium');
        expect(res.statusCode).toEqual(200);
    
    });

    it('1 : nutrition non auth : return the hoe page', async () => {
        
        const date = new Date()

        const testSession = session(app);
        const url = '/nutrition/'+ date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear();
        const res = await testSession.get(url).redirects(1);
        
        expect(res.req.path).toEqual('/');
    
    });

});

module.exports = nutritionTest
