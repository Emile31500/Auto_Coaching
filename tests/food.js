const app = require('../app')
const session = require('supertest-session');
const { Food } = require('../models');
const { generateRandomString, authUser, authAdmin } = require('./test.tools')

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

    it(' 0 : Should return a 401 error because not auth', async () => {


        const testSession = session(app)
        const res = await testSession
            .post('/api/admin/food')
            .send(rawData)
            .redirects(1)

        const food = Food.findOne({where : rawData});

        expect(!food.name).toEqual(true);
        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuré cette tâche");
        expect(res.req.path).toEqual('/api/admin/food');
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);


    });

    it(' 1 : Should return a home page because auth as user ', async () => {


        const testSession = await authUser();

        const res = await testSession
            .post('/api/admin/food')
            .send(rawData)
            .redirects(1);
        
        const food = await Food.findOne({where : rawData});

        expect(food).toEqual(null);
        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuré cette tâche");
        expect(res.req.path).toEqual('/api/admin/food');
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);

    });

    it(' 2 : Should create an instance of food', async () => {


        const testSession = await authAdmin();

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

        const food = await Food.findOne({where : {id : foodSeq.id}});

        expect(food.name).toEqual(foodSeq.name);
        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuré cette tâche");
        expect(res.req.path).toEqual('/api/admin/food/' + foodSeq.id);
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);

    });

    it(' 4 : Should return the home page', async () => {


        const testSession = await authUser();

        const foods = await Food.findAll({limits: 1});
        const foodSeq = foods[0];
        const foodBeforeUpdate = foodSeq

        const res = await testSession
            .patch('/api/admin/food/' + foodSeq.id)
            .send({name : "New food name" + generateRandomString(5)})
            .redirects(1);

        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuré cette tâche");
        expect(res.req.path).toEqual('/api/admin/food/' + foodSeq.id);
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);
        expect(foodBeforeUpdate.name).toEqual(foodSeq.name);


    });

    it(' 5 : Should update this food', async () => {

        const testSession = await authAdmin()

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

        const deletedFood = await Food.findOne({where : {id: food.id}});

        expect(deletedFood).toEqual(food);
        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuré cette tâche");
        expect(res.req.path).toEqual('/api/admin/food/' + food.id);
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);
        

    });

    it(" 7 : Sould not allow deletion of this food and redirect to home page", async () => {

        const testSession = await authUser();

        const food = await Food.findOne({where : rawData});
        
        const res = await testSession
            .delete('/api/admin/food/' + food.id)
            .redirects(1);

        const deletedFood = await Food.findOne({where : {id: food.id}});

        expect(deletedFood).toEqual(food);
        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuré cette tâche");
        expect(res.req.path).toEqual('/api/admin/food/' + food.id);
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);
        

    });

    it(" 8 :Sould delete this food", async () => {

        const testSession = await authAdmin();

        const food = await Food.findOne({where : rawData});
        
        const res = await testSession
            .delete('/api/admin/food/' + food.id)
            .redirects(1);

        const deletedFood = await Food.findOne({where : {id: food.id}});

        expect(res.statusCode).toEqual(204);
        expect(deletedFood).toEqual(null);
        expect(res.req.path).toEqual('/api/admin/food/' + food.id);
        
    });

    it(" 9 : Should return a food instance", async () => {

        const testSession = await authUser()

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
        expect(res.req.path).toEqual('/api/food/' + foodSeq.id);

    });

});

module.exports = foodTest;
