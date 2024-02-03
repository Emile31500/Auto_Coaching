const { JSDOM } = require('jsdom')
const app = require('../app')
const session = require('supertest-session');
const { authUser, createRandomUser, auth } = require('./test.tools');
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY)

const checkoutTest = describe('Checkout test', () => {

    /* it(' 0 : Should return a 401 error because not auth', async () => {

        const testSession = session(app)

        const res = await testSession
            .get('/premium')
            .redirects(1);
       
        const stringToParse = res.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;
    
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Erreur : 401');
        expect(DOM.querySelector('p').innerHTML).toBe('Vous devez être authentifié pour accéder à cette page.')
        expect(res.statusCode).toEqual(401);
    });

    it(' 1 : Should the premiums rates page', async () => {

        const testSession = await authUser();

        const res = await testSession
            .get('/premium')
            .redirects(1);
        
        const stringToParse = res.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;
        
        expect(res.req.path).toEqual('/premium');
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Abonnement premium');
        expect(res.statusCode).toEqual(200);

    });

    it(' 2 : Should return a 401 error because not auth', async () => {

        const products = await stripe.products.list({
            limit: 1,
        });

        const testSession = session(app);

        const url = '/checkout/' + products.data[0].id;

        const res = await testSession
            .get(url)
            .redirects(1);
        
        const stringToParse = res.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;
    
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Erreur : 401');
        expect(DOM.querySelector('p').innerHTML).toBe('Vous devez être authentifié pour accéder à cette page.')
        expect(res.statusCode).toEqual(401);

    });

    it(' 3 : Should return the checkout page for the 1st subscription', async () => {

        const user = await createRandomUser();

        const customerPromise = await stripe.customers.list({
            email: user.email,
            limit: 1
        })
    
        let customer = customerPromise.data[0]
    
        const products = await stripe.products.list({
            limit : 1
        });
        
        const authRawData = {
            email : user.email, 
            password : user.password
        }
        const testSession = await auth({email : user.email, password : user.password});

        const url = '/checkout/' + products.data[0].id;

        const res = await testSession 
            .get(url)
            .redirects(1);

        const stringToParse = res.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;

        expect(res.req.path).toEqual(url);
        expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(DOM.querySelector('h2').innerHTML).toBe('Procéder au paiement');
        expect(res.statusCode).toEqual(200);


        
    });*/

    it(' 4 : Should return the checkout page for the 1st subscription', async () => {

        const customers = await stripe.customers.list({
            email : 'emile00013+2@gmail.com',
            limit : 1
        })

        const cards = await stripe.cards.list({
            customer :  customers.data[0].id,
            limit : 1
        });

        const tokens = await stripe.tokens.create({card : {id : cards.data[0].id}});

        const products = await stripe.products.list({
            limit : 1
        });
        
        const testSession = await authUser();

        const url = '/api/checkout/'

        const res = await testSession 
            .post(url)
            .send({
                token : tokens,
                idProduct : products.data[0].id
            })
            .redirects(1);

        const stringToParse = res.text;
        const parsedString =  new JSDOM(stringToParse);
        const DOM = parsedString.window.document;

        expect(res.req.path).toEqual(url);
        expect(res._body.data.id).not.toBeNull();
        expect(res.statusCode).toEqual(201);

    });

});

module.exports = checkoutTest;
