const app = require('../app')
const session = require('supertest-session');
const { Food } = require('../models');
const { generateRandomString, authUser, authAdmin, authNonPremiumUser, authPremiumUser } = require('./test.tools')

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
    
    it(' 0 Test create food not auth : not crated redirect', async () => {


        const testSession = session(app)
        const res = await testSession
            .post('/food')
            .send(rawData)
            .redirects(1)

        const food = await Food.findOne({where : rawData});

        expect(food).not.toBeInstanceOf(Food);
        expect(res.req.path).toEqual('/');

    });

    it(' 1 Test create food auth user : not crated redirect', async () => {


        const [testSession, user] = await authPremiumUser();

        const res = await testSession
            .post('/food')
            .send(rawData)
            .redirects(2);
        
        const food = await Food.findOne({where : rawData});

        expect(food).not.toBeInstanceOf(Food);
        expect(res.req.path).toEqual('/');

    });

    it(' 2 Test create food auth admin : crated redirect', async () => {


        const testSession = await authAdmin();

        const res = await testSession
            .post('/food')
            .send(rawData)
            .redirects(1);
        
        const food = await Food.findOne({where : rawData});

        expect(food).toBeInstanceOf(Food);
        expect(res.req.path).toEqual('/admin/nutrition');

    });

    it(' 3 : Should return a 401 error page because not auth', async () => {

        const testSession = session(app)

        const foodSeq = await Food.findOne();

        const res = await testSession
            .patch('/api/admin/food/' + foodSeq.id)
            .send(rawData)
            .redirects(1);

        const food = await Food.findOne({where : {id : foodSeq.id}});

        expect(food.name).toEqual(foodSeq.name);
        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuter cette tâche");
        expect(res.req.path).toEqual('/api/admin/food/' + foodSeq.id);
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);

    });

    it(' 4.1 : Should return the home page', async () => {


        const [testSession, user] = await authPremiumUser();

        const foods = await Food.findAll({limits: 1});
        const foodSeq = foods[0];
        const foodBeforeUpdate = foodSeq

        const res = await testSession
            .patch('/api/admin/food/' + foodSeq.id)
            .send({name : "New food name" + generateRandomString(5)})
            .redirects(1);

        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuter cette tâche");
        expect(res.req.path).toEqual('/api/admin/food/' + foodSeq.id);
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);
        expect(foodBeforeUpdate.name).toEqual(foodSeq.name);


    });

    it(' 4.2 : Should return the 401', async () => {


        const [testSession, user] = await authNonPremiumUser();

        const foods = await Food.findAll({limits: 1});
        const foodSeq = foods[0];
        const foodBeforeUpdate = foodSeq

        const newName = "New food name" + generateRandomString(5)
        const res = await testSession
            .patch('/api/admin/food/' + foodSeq.id)
            .send({name : newName})
            .redirects(1);

        const food = await Food.findOne({ where : {
            id : foodSeq.id
        }});

        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuter cette tâche");
        expect(res.req.path).toEqual('/api/admin/food/' + food.id);
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);

    });

    it(' 5 : Should update this food', async () => {

        const testSession = await authAdmin()

        const foods = await Food.findAll({limits: 1});
        const foodSeq = foods[0];

        const newName = "New food name" + generateRandomString(5)
        const res = await testSession
            .patch('/api/admin/food/' + foodSeq.id)
            .send({name : newName })
            .redirects(1);

        const food = await Food.findOne({where : { id: foodSeq.id }});

        const foodApi = res._body.data;

        expect(foodApi.name).not.toEqual(foodSeq.name);
        expect(res.statusCode).toEqual(202);
        expect(food.name).toEqual(newName);


    });

    it(" 6 : Sould not allow deletion of this food, redirect to home page and print a 401 error", async () => {

        const testSession = session(app)
    
        const foods = await Food.findAll({ 
            where : {
                userId : null
            },
            limit: 1});
        const food = foods[0]
        
        const res = await testSession
            .delete('/api/food/' + food.id)
            .redirects(1);

        const deletedFood = await Food.findOne({where : {id: food.id}});

        expect(deletedFood).toEqual(food);
        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuter cette tâche");
        expect(res.req.path).toEqual('/api/food/' + food.id);
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);
        

    });

    it(" 7.1 : Sould not allow deletion of this food and redirect to home page", async () => {

        const [testSession, user] = await authPremiumUser();

        const foods = await Food.findAll({ 
            where : {
                userId : null
            },
            limit: 1});
        const food = foods[0]
        
        const res = await testSession
            .delete('/api/food/' + food.id)
            .redirects(1);

        const nonDeletedFood = await Food.findOne({where : {id: food.id}});

        expect(nonDeletedFood).toBeInstanceOf(Food);
        // expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuter cette tâche");
        expect(res.req.path).toEqual('/api/food/' + food.id);
        // expect(res.statusCode).toEqual(401);
        // expect(res._body.code).toEqual(401);
        

    });

    it(" 7.2 : Sould not allow deletion of this food and redirect to premium page", async () => {

        const [testSession, user] = await authNonPremiumUser();

        const foods = await Food.findAll({ 
            where : {
                userId : null
            },
            limit: 1});
        const food = foods[0]
        
        const res = await testSession
            .delete('/api/food/' + food.id)
            .redirects(1);

        const nonDeletedFood = await Food.findOne({where : {id: food.id}});

        expect(nonDeletedFood).toBeInstanceOf(Food);
        expect(res.req.path).toEqual('/api/food/' + food.id);

    });


    it(" 8 :Sould delete this food", async () => {

        const testSession = await authAdmin();

        const foods = await Food.findAll({ 
            where : {
                userId : null
            },
            limit: 1});
        const food = foods[0]
        
        const res = await testSession
            .delete('/api/food/' + food.id)
            .redirects(1);

        const deletedFood = await Food.findOne({where : {id: food.id}});

        expect(res.statusCode).toEqual(204);
        expect(deletedFood).toEqual(null);
        expect(res.req.path).toEqual('/api/food/' + food.id);
        
    });

     it(" 9 : get a food non premium user " , async () => {

        const [testSession, user] = await authNonPremiumUser()

        const foods = await Food.findAll({limit: 1});
        const foodSeq = foods[0]; 
        const res = await testSession
            .get('/api/food/' + foodSeq.id)
            .redirects(1);

        expect(res.req.path).toEqual('/premium');

    })

    it(" 10 : get a food premium user " , async () => {

        const [testSession, user] = await authPremiumUser()

        const foods = await Food.findAll({limit: 1});
        const foodSeq = foods[0]; 
        const res = await testSession
            .get('/api/food/' + foodSeq.id)
            .redirects(1);

        expect(res.statusCode).toEqual(200);
        expect(res._body.code).toEqual(200);
        const foodApi = res._body.data
        expect(foodApi.id).toEqual(foodSeq.id);
        expect(foodApi.name).toEqual(foodSeq.name);
        expect(res.req.path).toEqual('/api/food/' + foodSeq.id);

    });/**/


    // authNonPremiumUser
});

module.exports = foodTest;
