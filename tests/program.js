const session = require('supertest-session');
const cheerio = require("cheerio");
const app = require('../app')
const { ProgramDraft, Program, Train , ExerciseTrain, TrainDraft, ExerciseTrainDraft, Exercise } = require('../models')
const { authAdmin, authPremiumUser, authNonPremiumUser } = require('./test.tools');

const programTest = describe('Trains tests', () => {

    it(' 1.0 : publish program not auth : to the home page', async () => {

        const testSession = session(app);

        const programDraft = await ProgramDraft.findOne({
                include: [
                    {
                    model: Program,
                    required: false // LEFT JOIN
                    }
                ],
                where: {
                    '$Program.id$': null // no related Program
                }
            });

        const res = await testSession.get('/program-draft/'+programDraft.id+ '/publish').redirects(1);
        const nullOrProgram = await Program.findOne({ where : { programDraftId : programDraft.id}});
        const $ = cheerio.load(res.text);
        
        // expect($('.alert-warning').html()).toMatch(null);
        // expect($('.alert-danger').html()).toMatch(null);
        // expect($('.alert-success').html()).toMatch(null);

        console.log($('.alert-warning').text())
        console.log($('.alert-danger').text())
        console.log($('.alert-success').text());

        ///expect(res.statusCode).toEqual(200);
        expect(res.req.path).toEqual('/');
        expect(nullOrProgram).not.toBeInstanceOf(Program);
    
    });

    it(' 1.1 : publish program non premium user auth : to the home page', async () => {

        const [testSession, user] = await authNonPremiumUser();


        const programDraft = await ProgramDraft.findOne({
                include: [
                    {
                    model: Program,
                    required: false // LEFT JOIN
                    }
                ],
                where: {
                    '$Program.id$': null // no related Program
                }
            });

        const res = await testSession.get('/program-draft/'+programDraft.id+ '/publish').redirects(1);
        const nullOrProgram = await Program.findOne({ where : { programDraftId : programDraft.id}})
        const $ = cheerio.load(res.text);
        
        // expect($('.alert-warning').html()).toMatch(null);
        // expect($('.alert-danger').html()).toMatch(null);
        // expect($('.alert-success').html()).toMatch(null);

        console.log($('.alert-warning').text())
        console.log($('.alert-danger').text())
        console.log($('.alert-success').text());

        ///expect(res.statusCode).toEqual(200);
        expect(res.req.path).toEqual('/');
        expect(nullOrProgram).not.toBeInstanceOf(Program);
    
    });


    it(' 1.2 : publish program premium user auth : to the home page', async () => {

        const [testSession, user] = await authPremiumUser();

        const programDraft = await ProgramDraft.findOne({
                include: [
                    {
                    model: Program,
                    required: false // LEFT JOIN
                    }
                ],
                where: {
                    '$Program.id$': null // no related Program
                }
            });

        const res = await testSession.get('/program-draft/'+programDraft.id+ '/publish').redirects(1);
        const nullOrProgram = await Program.findOne({ where : { programDraftId : programDraft.id}})
        const $ = cheerio.load(res.text);
    
        // expect($('.alert-warning').html()).toMatch(null);
        // expect($('.alert-danger').html()).toMatch(null);
        // expect($('.alert-success').html()).toMatch(null);

        console.log($('.alert-warning'))
        console.log($('.alert-danger'))
        console.log($('.alert-success'));

        ///expect(res.statusCode).toEqual(200);
        expect(res.req.path).toEqual('/');
        expect(nullOrProgram).not.toBeInstanceOf(Program);
    
    });

    it(' 1.3 : publish program admin auth : to the home page', async () => {

        const testSession = await authAdmin();

        const programDraft = await ProgramDraft.findOne({
            include: [
                 {
                    model: Program,
                    required: false, 
                    where: {
                        id: null // no related Program
                    }
                },
                {
                    model: TrainDraft,
                    required: false, 
                    include : {
                        model : ExerciseTrainDraft,
                        required: false
                    }
                }
            ],
            
        });
        const res = await testSession.get('/program-draft/'+programDraft.id+ '/publish').redirects(1);
        const programOrNull = await Program.findOne({ include : {
                model : Train,
                include : {
                    model : ExerciseTrain,
                    required : false
                },  
                required : false
            }, where : { programDraftId : programDraft.id}})
        const $ = cheerio.load(res.text);


        expect(res.req.path).toEqual('/admin/train');
        expect($('.alert-success').html()).toMatch(' ');
        expect($('.alert-success').html()).toMatch(`Le programme ${programOrNull.name} a bien été publié`);

        expect(programOrNull).toBeInstanceOf(Program);
        // expect(programOrNull.imageUrl).toEqual(programDraft.imageUrl);
        expect(programOrNull.programDraftId).toEqual(programDraft.id);
        expect(programOrNull.name).toEqual(programDraft.name);
        expect(programOrNull.description).toEqual(programDraft.description);

        for (let indexProgram = 0; indexProgram < programDraft.TrainDrafts.length; indexProgram++) {
            
            programDraft.TrainDrafts[indexProgram];

            expect(programOrNull.Trains[indexProgram].name).toEqual(programDraft.TrainDrafts[indexProgram].name);
            // expect(programOrNull.Trains[indexProgram].description).toEqual(programDraft.TrainDrafts[indexProgram].description);

            for (let indexTrain = 0; indexTrain < programDraft.TrainDrafts[indexProgram].ExerciseTrainDrafts.length; indexTrain++) {

                expect(programOrNull.Trains[indexProgram].ExerciseTrains[indexTrain].reps).toEqual(programDraft.TrainDrafts[indexProgram].ExerciseTrainDrafts[indexTrain].reps);
                expect(programOrNull.Trains[indexProgram].ExerciseTrains[indexTrain].sets).toEqual(programDraft.TrainDrafts[indexProgram].ExerciseTrainDrafts[indexTrain].sets);
                expect(programOrNull.Trains[indexProgram].ExerciseTrains[indexTrain].repsMode).toEqual(programDraft.TrainDrafts[indexProgram].ExerciseTrainDrafts[indexTrain].repsMode);
                expect(programOrNull.Trains[indexProgram].ExerciseTrains[indexTrain].exerciseId).toEqual(programDraft.TrainDrafts[indexProgram].ExerciseTrainDrafts[indexTrain].exerciseId);
                expect(programOrNull.Trains[indexProgram].ExerciseTrains[indexTrain].tranId).toEqual(programDraft.TrainDrafts[indexProgram].ExerciseTrainDrafts[indexTrain].tranId);

            }
        }
    
    });/**/
});

module.exports = programTest;
