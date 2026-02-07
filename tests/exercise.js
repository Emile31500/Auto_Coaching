const app = require('../app')
const session = require('supertest-session');
const { Exercise } = require('../models');
const { generateRandomString, authUser, authAdmin } = require('./test.tools');


const ExerciseTest = describe('Exercises tests', () => {
    
    const rawData = {

        name : 'Exercise ' + generateRandomString(5)

    }

    it(' 0 : Should return a 401 error because admin not auth', async () => {

        const testSession = session(app);

        const res = await testSession
            .post('/api/admin/exercise')
            .send(rawData)
            .redirects(1);
            
        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuter cette tâche");
        expect(res.req.path).toEqual('/api/admin/exercise');
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);
    

    });

    it(' 1 : Should return a 401 error because auth as user', async () => {

        const testSession = await authUser();

        const res = await testSession
            .post('/api/admin/exercise')
            .send(rawData)
            .redirects(1);
            
        expect(res._body.data).toBeUndefined();
        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuter cette tâche");
        expect(res.req.path).toEqual('/api/admin/exercise');
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);
    

    });

    it(' 2 : Should create an exercise', async () => {

        const testSession = await authAdmin()

        const res = await testSession
            .post('/api/admin/exercise')
            .send(rawData)
            .redirects(1);
        
        const apiExercise = res._body.data;
        const seqExercise = await Exercise.findOne({where : {id : apiExercise.id}})

        expect(apiExercise.id).toEqual(seqExercise.id);
        expect(res.req.path).toEqual('/api/admin/exercise');
        expect(res.statusCode).toEqual(201);
        expect(res._body.code).toEqual(201);
    

    });


    it(' 3 : Should return a 401 error because admin not auth', async () => {

        const testSession = session(app);

        const res = await testSession
            .get('/api/admin/exercise')
            .redirects(1);
            
        expect(res._body.data).toBeUndefined();
        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuter cette tâche");
        expect(res.req.path).toEqual('/api/admin/exercise');
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);
    

    });

    it(' 4 : Should return a 401 error because auth as user', async () => {

        const testSession = await authUser();

        const res = await testSession
            .get('/api/admin/exercise')
            .redirects(1);
            
        expect(res._body.data).toBeUndefined();
        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuter cette tâche");
        expect(res.req.path).toEqual('/api/admin/exercise');
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);
    

    });

    it(' 5 : Should list all exercises', async () => {

        const testSession = await authAdmin()

        const res = await testSession
            .get('/api/admin/exercise')
            .redirects(1);

        expect(res.req.path).toEqual('/api/admin/exercise');
        expect(res.statusCode).toEqual(200);
        expect(res._body.code).toEqual(200);

        res._body.data.forEach(async (apiExercise) => {

            let seqExercise = await Exercise.findOne({where : {id : apiExercise.id}});
            expect(apiExercise.id).toEqual(seqExercise.id);

        });
    });

    it(' 6 : Should return a 401 error because admin not auth', async () => {

        const testSession = session(app);

        const exercise = await Exercise.findOne();
        const url = '/api/admin/exercise/' + exercise.id;

        const res = await testSession
            .delete(url)
            .redirects(1);
        
        const seqExercise = await Exercise.findOne({where : {id : exercise.id}});

        expect(seqExercise).toEqual(exercise);
        expect(res._body.data).toBeUndefined();
        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuter cette tâche");
        expect(res.req.path).toEqual(url);
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);
    

    });

    it(' 7 : Should return a 401 error because auth as user', async () => {

        const testSession = await authUser()
        
        const exercise = await Exercise.findOne();
        const url = '/api/admin/exercise/' + exercise.id;

        const res = await testSession
            .delete(url)
            .redirects(1);

        const seqExercise = await Exercise.findOne({where : {id : exercise.id}});

        expect(seqExercise).toEqual(exercise);
        expect(res._body.data).toBeUndefined();
        expect(res._body.message).toEqual("Vous n'êtes pas autorisé à exécuter cette tâche");
        expect(res.req.path).toEqual(url);
        expect(res.statusCode).toEqual(401);
        expect(res._body.code).toEqual(401);
    

    });

    it(' 8 : Should list all exercises', async () => {

        const testSession = await authAdmin()

        const exercise = await Exercise.findOne();
        const url = '/api/admin/exercise/' + exercise.id;
    
        const res = await testSession
            .delete(url)
            .redirects(1);

        const seqExercise = await Exercise.findOne({where : {id : exercise.id}});

        expect(seqExercise).toBeNull();
        expect(res.req.path).toEqual(url);
        expect(res.statusCode).toEqual(204);

    });


});

module.exports = ExerciseTest;
