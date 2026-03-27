const app = require('../app')
const session = require('supertest-session');
const { Exercise } = require('../models');
const { generateRandomString, authAdmin, authPremiumUser, authNonPremiumUser } = require('./test.tools');
const cheerio = require("cheerio");

const ExerciseTest = describe('Exercises tests', () => {
    
    const rawData = {

        name : 'Exercise ' + generateRandomString(5),
        imageUrlGif : 'placeholder.gif',
        imageUrlPng : 'placeholder.png'

    }

    it(' 0 Test add exercise not auth : no creation', async () => {

        const testSession = session(app);

        await Exercise.destroy({ where : { name : rawData.name}});

        const res = await testSession
            .post('/admin/exercise')
            .send(rawData)
            .redirects(2);

        const exercise = await Exercise.findOne({ where : { name : rawData.name}});
        expect(res.req.path).toEqual('/');
        expect(exercise).not.toBeInstanceOf(Exercise);

    });

    it(' 1 Test add exercise auth user : no creation', async () => {

        const testSession = await authPremiumUser();

        await Exercise.destroy({ where : { name : rawData.name}});

        const res = await testSession
            .post('/admin/exercise')
            .send(rawData)
            .redirects(2);

        const exercise = await Exercise.findOne({ where : { name : rawData.name}});
        expect(res.req.path).toEqual('/');
        expect(exercise).not.toBeInstanceOf(Exercise);
    

    });

    it(' 2 Test add exercise auth admin : creation', async () => {

        const testSession = await authAdmin()
        await Exercise.destroy({ where : { name : rawData.name}});

        const res = await testSession
            .post('/admin/exercise')
            .send(rawData)
            .redirects(2);
        
        const stringToParse = res.text;
        const $ = cheerio.load(stringToParse);

        const exercise = await Exercise.findOne({ where : { name : rawData.name}});
        expect(res.req.path).toEqual('/admin/train');
        expect($('.alert-success').text()).toMatch(`L'exercice ${exercise.name} a bien été créé`);
        expect(exercise).toBeInstanceOf(Exercise)
    

    });


    it(' 3 Test exercise admin page index not auth : return to home page ', async () => {

        const testSession = session(app);

        const res = await testSession
            .get('/admin/train')
            .redirects(1);
            
        expect(res.req.path).toEqual('/');    

    });

    it(' 4 Test exercise admin page index auth user : return to home page ', async () => {

        const testSession = await authPremiumUser();


        const res = await testSession
            .get('/admin/train')
            .redirects(1);

        const stringToParse = res.text;
        const $ = cheerio.load(stringToParse);
            
        expect(res.req.path).toEqual('/');
    

    });

    it(' 5 Test exercise admin page index auth admin : 200', async () => {

        const testSession = await authAdmin()

        const res = await testSession
            .get('/admin/train')
            .redirects(1);

        expect(res.req.path).toEqual('/admin/train');
        expect(res.statusCode).toEqual(200);
    });

    it(' 6 Test delete exercise not auth : redirect not deleted', async () => {

        const testSession = session(app);

        const exercise = await Exercise.findOne();
        const url = '/admin/exercise/' + exercise.id + '/delete';

        const res = await testSession
            .get(url)
            .redirects(1);
        
        const seqExercise = await Exercise.findOne({where : {id : exercise.id}});
        expect(seqExercise).toBeInstanceOf(Exercise);
        expect(res.req.path).toEqual('/');
    
    });

    it(' 7 Test delete exercise auth user : redirect not deleted', async () => {

        const testSession = await authPremiumUser();
        
        const exercise = await Exercise.findOne();
        const url = '/admin/exercise/' + exercise.id + '/delete';

        const res = await testSession
            .get(url)
            .redirects(2);

        const seqExercise = await Exercise.findOne({where : {id : exercise.id}});
        expect(seqExercise).toBeInstanceOf(Exercise);
        expect(res.req.path).toEqual('/');

    });

    it(' 8 Test delete exercise auth admin : redirect deleted', async () => {

        const testSession = await authAdmin()

        const exercises = await Exercise.findAll();
        const exercise = exercises[0];
        const exerciseName = exercise.libele;
        const url = '/admin/exercise/' + exercise.id + '/delete';
    
        const res = await testSession
            .get(url)
            .redirects(1);
                    
        const stringToParse = res.text;
        const $ = cheerio.load(stringToParse);

        const seqExercise = await Exercise.findOne({where : {id : exercise.id}});
        expect(seqExercise).not.toBeInstanceOf(Exercise);
        expect(res.req.path).toEqual('/admin/train');
        expect($('.alert-success').text()).toMatch(`L'exercice ${exerciseName} a bien été supprimé`);


        // toMatch
        // ($('.alert-success').text()).stringContaining(`L'exercice ${exerciseName} a bien été supprimé`);

        // expect($('.alert-success').text()).stringContaining(`L'exercice ${exerciseName} a bien été supprimé`);

    });/**/
});

module.exports = ExerciseTest;
'/admin/train'