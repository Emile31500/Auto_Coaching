const cheerio = require("cheerio");
const app = require('../app')
const session = require('supertest-session');
const { AteFood, Food, User } = require('../models');
const { getDate, randomInt, authNonPremiumUser, authPremiumUser } = require('./test.tools.js');

const AteFoodTest = describe('Ate food tests', () => {
    

    it(' 0 : Should return a 401 error page because not auth', async () => {

        const currentDateTime = getDate();
        const testSession = session(app)
        const res = await testSession
            .get('/food/ate/' + currentDateTime)
            .redirects(1);

        const stringToParse = res.text;
        const $ = cheerio.load(stringToParse);

        // expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
        expect(res.req.path).toEqual('/');
        expect($('#hook-phrase').html()).toBe('Un programme remise en forme  enfin fait pour vous ! ');
        expect(res.statusCode).toEqual(200);

    });

    it(' 1.1 : ate food page non premium user : Should return the premium page', async () => {

        const [testSession, user] = await authNonPremiumUser()

        const ymdDate =  '2026-03-24 00:00:00'
        const frenchDate =  'Mardi 24 mars 2024'
        const res = await testSession
            .get('/food/ate/' + ymdDate)
            .redirects(1);

        const stringToParse = res.text;
        const $ = cheerio.load(stringToParse);

        expect(res.req.path).toEqual('/premium');

    });

     it(' 1.2 : ate food page premium user : Should return the ate food page', async () => {

        const [testSession, user] = await authPremiumUser()

        const ymdDate =  '2026-03-24 00:00:00';
        const frenchDate =  'Mardi 24 mars 2026';
        const url = '/food/ate/' + ymdDate;
        const res = await testSession
            .get(url)
            .redirects(1);

        const stringToParse = res.text;
        const $ = cheerio.load(stringToParse);

        expect(res.req.path.replace('%20', ' ')).toEqual(url);
        expect($('h2').html()).toMatch('Détails de la diette de ce jour :');
        expect($('h3').html()).toBe(frenchDate);
        expect(res.statusCode).toEqual(200);

    });

    it(' 2.1 : Should return a 401 error beacause user not auth', async () => {

        const currentDateTime = getDate();

        const testSession = session(app)

        const food = await Food.findOne()
        const weight = randomInt()

        const raw = {
            foodId : food.id,
            weight : weight,
            date : currentDateTime
        }

        const res = await testSession
            .post('/food/ate/')
            .send(raw)
            .redirects(1);

        const nullORfood = await AteFood.findOne({where : raw})
        expect(res.req.path).toEqual('/');
        expect(nullORfood).not.toBeInstanceOf(AteFood);


    });

    it(' 3.1 : Add ate food non premium user : shoud return premium pge', async () => {

        const currentDateTime = getDate();

        const [testSession, user] = await authNonPremiumUser()

        const food = await Food.findOne()
        const weight = randomInt()

        const raw = {
            foodId : food.id,
            weight : weight,
            date : currentDateTime
        }
        
        


        const res = await testSession
            .post('/food/ate/')
            .send(raw)
            .redirects(1);
        
        const nullORfood = await AteFood.findOne({where : raw})

        expect(res.req.path).toEqual('/premium');
        expect(nullORfood).not.toBeInstanceOf(AteFood);


    });

    it(' 3.2 : Add ate food premim user : create ate food return to nutrition page', async () => {

        const currentDateTime = getDate();

        const [testSession, user] = await authPremiumUser()

        const food = await Food.findOne()
        const weight = randomInt()

        const raw = {
            foodId : food.id,
            weight : weight,
            date : currentDateTime
        }

        const res = await testSession
            .post('/food/ate/')
            .send(raw)
            .redirects(1);

        const stringToParse = res.text;
        const $ = cheerio.load(stringToParse);

        expect(res.req.path.replace('%20', ' ')).toMatch('/nutrition/20');
        expect($('.title-zone-al-need').html()).toMatch(new Date(currentDateTime).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        );
        expect($('.alert-success').html()).toMatch('Cet aliment a bien été ajouté à la diet du ');
        const foodOrNull = await AteFood.findOne({where : raw})
        expect(foodOrNull).toBeInstanceOf(AteFood);


    });

    // TODO : test deletion of other food tenant

    it(' 4 : test delete not auth : should return to the home page', async () => {

        const testSession = session(app)
        const ateFood = await AteFood.findOne()
        const id = ateFood.id;
        const res = await testSession
            .get('/delete/food/ate/'+id)
            .redirects(1);
            
        const ateFoodOrNull = await AteFood.findOne({where : { id : id}})
        expect(res.req.path).toEqual('/');
        expect(ateFoodOrNull).toBeInstanceOf(AteFood);
        expect(ateFoodOrNull).toEqual(ateFood);

    });

    it(' 5.1 : test delete auth not premium : should return to the premium', async () => {

        const [testSession, user] = await authNonPremiumUser()
        const ateFood = await AteFood.findOne()
        const id = ateFood.id;
        const res = await testSession
            .get('/delete/food/ate/'+id)
            .redirects(1);
            
        const ateFoodOrNull = await AteFood.findOne({where : { id : id}})
        expect(res.req.path).toEqual('/premium');
        expect(ateFoodOrNull).toBeInstanceOf(AteFood);
        expect(ateFoodOrNull).toEqual(ateFood);

    });

    it(' 5.2 : test delete auth premium : should delete and return ate food page', async () => {

        const [testSession, user] = await authPremiumUser();
        const ateFood = await AteFood.findOne();
        const recoveryAteFood = ateFood.toJSON();

        const frenchDate = new Date(ateFood.date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).replace(/^./, c => c.toUpperCase()) 

        const id = ateFood.id;
        const res = await testSession
            .get('/delete/food/ate/'+id)
            .redirects(1);

        const stringToParse = res.text;
        const $ = cheerio.load(stringToParse);
            
        const nullOrAteFood = await AteFood.findOne({where : { id : id}})
        expect(nullOrAteFood).not.toBeInstanceOf(AteFood);
        expect(res.req.path.replace('%20', ' ')).toMatch('/food/ate/20');
        expect($('h2').html()).toMatch('Détails de la diette de ce jour :');
        expect($('h3').html()).toMatch(frenchDate);
        expect(res.statusCode).toEqual(200);
        await AteFood.create(recoveryAteFood)

    });

    /*it(' 4 : Should return a 401 error page because not auth', async () => {

        const currentDateTime = getDate();
        const tomorowDateTime = getDate(1);

        const testSession = session(app)
        const res = await testSession
            .get('/api/food/ate/' + currentDateTime + '/' + tomorowDateTime)
            .redirects(1);

        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuter cette tâche");
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);

    });*/

    /*it(' 5 : Should get a list of ate food', async () => {

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

    });*/

    it(' 6 : Update ate food non auto : return to home page', async () => {

        const currentDateTime = getDate();

        const testSession = session(app)
        const ateFood = await AteFood.findOne({include : Food})
        const preventWeight = ateFood.weight;
        let newWieght;
        
        do {

            newWieght = randomInt()

        } while (newWieght ===  ateFood.weight)

            
        const raw = {
            foodId : ateFood.Food.id,
            weight : newWieght,
            date : currentDateTime
        }

        const res = await testSession
            .post('/food/ate/'+ateFood.foodId)
            .send(raw)
            .redirects(1);

        const nullORfood = await AteFood.findOne({where : raw})
        expect(res.req.path).toEqual('/');
        expect(nullORfood).not.toBeInstanceOf(AteFood);
        expect(ateFood.weight).toEqual(preventWeight);

    });

    it(' 7.1 : Update ate food non premium user : should return premium page', async () => {

        const currentDateTime = getDate();

        const [testSession, user] = await authNonPremiumUser()
        const ateFood = await AteFood.findOne({include : Food})
        const preventWeight = ateFood.weight;
        let newWieght;
        
        do {

            newWieght = randomInt()

        } while (newWieght ===  ateFood.weight)

            
        const raw = {
            foodId : ateFood.Food.id,
            weight : newWieght,
            date : currentDateTime
        }

        const res = await testSession
            .post('/food/ate/'+ateFood.foodId)
            .send(raw)
            .redirects(1);

        
        const nullORfood = await AteFood.findOne({where : raw})
        expect(res.req.path).toEqual('/premium');
        expect(nullORfood).not.toBeInstanceOf(AteFood);
        expect(ateFood.weight).toEqual(preventWeight);


    });

    it(' 7.2 : Update ate food premium user : should return premium page', async () => {

        const currentDateTime = getDate();
        const [testSession, user] = await authPremiumUser();
        const ateFood = await AteFood.findOne({include : Food})
        const preventWeight = ateFood.weight;
        let newWieght;
        
        do newWieght = randomInt(); while (newWieght ===  ateFood.weight);
   
        const raw = {
            foodId : ateFood.Food.id,
            weight : newWieght,
            date : currentDateTime
        }

        const frenchDate = new Date(ateFood.date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).replace(/^./, c => c.toUpperCase()) 

        const res = await testSession
            .post('/food/ate/'+ateFood.foodId)
            .send(raw)
            .redirects(1);

        const stringToParse = res.text;
        const $ = cheerio.load(stringToParse);
        const foodOrNull = await AteFood.findOne({where : raw})

        expect(res.req.path).toMatch('/food/ate/20');
        expect($('h2').html()).toMatch('Détails de la diette de ce jour :');
        expect($('h3').html()).toBe(frenchDate);
        expect(res.statusCode).toEqual(200);
        expect($('.alert-success').html()).toMatch(`L'aliment : ${ateFood.Food.name} a bien été mis à jour dans votre diet.`);
        expect(foodOrNull).toBeInstanceOf(AteFood);

    });
});

module.exports = AteFoodTest;
