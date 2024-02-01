const { Measurment, User } = require('../models')
const app = require('../app')
const session = require('supertest-session');
const { getDate, randomInt, authUser } = require('./test.tools')

const MeasurmentTest = describe('Measurments tests', () => {

    const rawData = {

        weight: randomInt(),
        size: randomInt(200),
        suroundShoulers: randomInt(150),
        suroundWaist: randomInt(50),
        suroundArms: randomInt(50),
        suroundChest: randomInt()

    }

    it (' 0 : Should return 401 error because not auth', async() => {

        const testSession = session(app);

        const res = await testSession
            .post('/api/measurment')
            .send(rawData)
            .redirects(1);

        expect(res.req.path).toEqual('/api/measurment')
        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuré cette tâche");
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);
    });

    it (' 1 : Should create a new measurment', async() => {

       
        const testSession = await authUser();

        const res = await testSession
            .post('/api/measurment')
            .send(rawData)
            .redirects(1);

        console.log(res._body);
        
        const apiMeasurment = res._body.data;
        const seqMeasurment = await Measurment.findOne({where : {id : apiMeasurment.id}});

        expect(apiMeasurment.id).toEqual(seqMeasurment.id);
        expect(res.req.path).toEqual('/api/measurment');
        expect(res.statusCode).toEqual(201);
        expect(res._body.code).toEqual(201);
    });

    it (' 2 : Should return 401 error because not auth', async() => {

        const testSession = session(app);

        const res = await testSession
            .get('/api/measurment')
            .redirects(1);

        expect(res.req.path).toEqual('/api/measurment')
        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuré cette tâche");
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);
    });

    it (' 3 : Should return a measurment list', async() => {

        const user = await User.findOne({where : {email : 'emile00013+2@gmail.com'}});
        const testSession = await authUser();

        const res = await testSession
            .get('/api/measurment')
            .redirects(1);
        
        const apiMeasurments = res._body.data;
        const seqMeasurments = await Measurment.findAll({where : {userId : user.id}, order: [['createdAt', 'DESC']]});

        expect(apiMeasurments.length).toEqual(seqMeasurments.length);
        for (let i = 0; i < apiMeasurments.length; i++) {

            expect(apiMeasurments[i].id).toEqual(seqMeasurments[i].id);
            expect(apiMeasurments[i].userId).toEqual(user.id);


        }
        expect(res.req.path).toEqual('/api/measurment');
        expect(res.statusCode).toEqual(200);
        expect(res._body.code).toEqual(200);
    });

});

module.exports = MeasurmentTest;
