const app = require('../app')
const session = require('supertest-session');
const { Performance } = require('../models');
const { randomInt, getDate } = require('./test.tools')

const PerformanceTest = describe('Performance tests', () => {

    const raw = {
        squat : randomInt(),
        bench : randomInt(),
        deadlift : randomInt(),
        createdAt : getDate(),
        updatedAt : getDate()

    }

    it(' 0 : Should return a 401 error page because not auth', async () => {

        const testSession = session(app)
        const res = await testSession
            .get('/api/performance/')
            .redirects(1);

        expect(res.req.path).toEqual('/api/performance/')
        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuré cette tâche");
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);

    });

    it(' 1 : Should return a performance list', async () => {

        const testSession = session(app)

        const authReq = await testSession
            .post('/login')
            .send({email : "emile00013+2@gmail.com", password: "P4$$w0rd"})
            .redirects(1);

        expect(authReq.statusCode).toEqual(200);

        const res = await testSession
            .get('/api/performance/')
            .redirects(1);

        res._body.data

        expect(res.req.path).toEqual('/api/performance/')
        expect(res.statusCode).toEqual(200);
        expect(res._body.code).toEqual(200);

        res._body.data.forEach(performance => {

            expect(typeof performance.id).toEqual("number");

        })

    });

    it(' 2 : Should return a 401 error page because not auth', async () => {

        const testSession = session(app)
        const res = await testSession
            .post('/api/performance/')
            .send(raw)
            .redirects(1);

        res._body.data

        expect(res.req.path).toEqual('/api/performance/')
        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuré cette tâche");
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);

    });

    it(' 3 : Should return a performance list', async () => {

        const testSession = session(app)

        const authReq = await testSession
            .post('/login')
            .send({email : "emile00013+2@gmail.com", password: "P4$$w0rd"})
            .redirects(1);

        expect(authReq.statusCode).toEqual(200);

        const res = await testSession
            .post('/api/performance/')
            .send(raw)
            .redirects(1);

        const performanceSeq = await Performance.findOne({where : {id : res._body.data.id}});

        expect(res.req.path).toEqual('/api/performance/')
        expect(res.statusCode).toEqual(201);
        expect(res._body.code).toEqual(201);
        expect(typeof res._body.data.id).toEqual("number");
        expect(res._body.data.id).toEqual(performanceSeq.id);


    });

});

module.exports = PerformanceTest
