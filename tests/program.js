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

    it(' 1.3 : publish program admin auth : publish in the same order and return to the train admin page', async () => {

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
            order: [
                [{ model: TrainDraft }, 'ordering', 'ASC'],
                [{ model: TrainDraft }, { model: ExerciseTrainDraft }, 'ordering', 'ASC']

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
            }, 
            where : { programDraftId : programDraft.id},
            order: [
                [{ model: Train }, 'ordering', 'ASC'],
                [{ model: Train }, { model: ExerciseTrain }, 'ordering', 'ASC']

            ],
        })
        const $ = cheerio.load(res.text);


        expect(res.req.path).toEqual('/admin/train');
        expect($('.alert-success').html()).toMatch(' ');
        expect($('.alert-success').html()).toMatch(`Le programme ${programOrNull.name} a bien été publié`);

        expect(programOrNull).toBeInstanceOf(Program);
        // expect(programOrNull.imageUrl).toEqual(programDraft.imageUrl);
        expect(programOrNull.programDraftId).toEqual(programDraft.id);
        expect(programOrNull.name).toEqual(programDraft.name);
        expect(programOrNull.description).toEqual(programDraft.description);
        expect(programOrNull.Trains.length).toEqual(programDraft.TrainDrafts.length);

        for (let indexProgram = 0; indexProgram < programDraft.TrainDrafts.length; indexProgram++) {
            
            programDraft.TrainDrafts[indexProgram];

            expect(programOrNull.Trains[indexProgram].ordering).toEqual(programDraft.TrainDrafts[indexProgram].ordering);
            expect(programOrNull.Trains[indexProgram].name).toEqual(programDraft.TrainDrafts[indexProgram].name);
            expect(programOrNull.Trains[indexProgram].description).toEqual(programDraft.TrainDrafts[indexProgram].description);

            for (let indexTrain = 0; indexTrain < programDraft.TrainDrafts[indexProgram].ExerciseTrainDrafts.length; indexTrain++) {

                // expect(programOrNull.Trains[indexProgram].ExerciseTrains[indexTrain]).toEqual(programDraft.TrainDrafts[indexProgram].ExerciseTrainDrafts[indexTrain]);
                expect(programOrNull.Trains[indexProgram].ExerciseTrains.length).toEqual(programDraft.TrainDrafts[indexProgram].ExerciseTrainDrafts.length);

                expect(programOrNull.Trains[indexProgram].ExerciseTrains[indexTrain].reps).toEqual(programDraft.TrainDrafts[indexProgram].ExerciseTrainDrafts[indexTrain].reps);
                expect(programOrNull.Trains[indexProgram].ExerciseTrains[indexTrain].sets).toEqual(programDraft.TrainDrafts[indexProgram].ExerciseTrainDrafts[indexTrain].sets);
                expect(programOrNull.Trains[indexProgram].ExerciseTrains[indexTrain].repsMode).toEqual(programDraft.TrainDrafts[indexProgram].ExerciseTrainDrafts[indexTrain].repsMode);
                expect(programOrNull.Trains[indexProgram].ExerciseTrains[indexTrain].exerciseId).toEqual(programDraft.TrainDrafts[indexProgram].ExerciseTrainDrafts[indexTrain].exerciseId);
                expect(programOrNull.Trains[indexProgram].ExerciseTrains[indexTrain].tranId).toEqual(programDraft.TrainDrafts[indexProgram].ExerciseTrainDrafts[indexTrain].tranId);

            }
        }
    
    });/**/

    it(' 2.0 : delete program draft non auth : should return to the home page', async () => {

        const testSession = session(app);


        const programDraft = await ProgramDraft.findOne({
            include: [{model: Program}]
        });

        const res = await testSession.get('/program-draft/'+programDraft.id+ '/delete').redirects(1);

        const programDraftOrNull = await ProgramDraft.findOne({ where : { id : programDraft.id }});
        const programOrNull = await Program.findOne({ where : { programDraftId : programDraft.id}});
        const $ = cheerio.load(res.text);
        
        expect(res.req.path).toEqual('/');
        expect(programOrNull).toBeInstanceOf(Program);
        expect(programDraftOrNull).toBeInstanceOf(ProgramDraft);

    });

     it(' 2.1 : delete program draft auth non premium user : should return to the home page', async () => {

        const [testSession, user] = await authNonPremiumUser();

       const programDraft = await ProgramDraft.findOne({
            include: [{model: Program}]
        });

        const res = await testSession.get('/program-draft/'+programDraft.id+ '/delete').redirects(1);

        const programDraftOrNull = await ProgramDraft.findOne({ where : { id : programDraft.id }});
        const programOrNull = await Program.findOne({ where : { programDraftId : programDraft.id}});
        const $ = cheerio.load(res.text);
        
        expect(res.req.path).toEqual('/');
        expect(programOrNull).toBeInstanceOf(Program);
        expect(programDraftOrNull).toBeInstanceOf(ProgramDraft);

    });

    it(' 2.2 : delete program draft auth premium user: should return to the home page', async () => {

        const [testSession, user] = await authPremiumUser();

        const programDraft = await ProgramDraft.findOne({
            include: [{model: Program}]
        });

        const res = await testSession.get('/program-draft/'+programDraft.id+ '/delete').redirects(1);

        const programDraftOrNull = await ProgramDraft.findOne({ where : { id : programDraft.id }});
        const programOrNull = await Program.findOne({ where : { programDraftId : programDraft.id}});
        const $ = cheerio.load(res.text);
        
        expect(res.req.path).toEqual('/');
        expect(programOrNull).toBeInstanceOf(Program);
        expect(programDraftOrNull).toBeInstanceOf(ProgramDraft);

    });

    it(' 2.3 : delete program draft auth admin : should delete program and program draft return to the train admin page', async () => {

        const testSession = await authAdmin();

        const programDraft = await ProgramDraft.findOne({
            include: [{model: Program}]
        });

        const programName = programDraft.name;

        const res = await testSession.get('/program-draft/'+programDraft.id+ '/delete').redirects(1);

        const nllOrProgramDraft = await ProgramDraft.findOne({ where : { id : programDraft.id }});
        const nullOrProgram = await Program.findOne({ where : { programDraftId : programDraft.id}});
        const $ = cheerio.load(res.text);
        
        expect(res.req.path).toEqual('/admin/train');
        expect(nullOrProgram).not.toBeInstanceOf(Program);
        expect(nllOrProgramDraft).not.toBeInstanceOf(ProgramDraft);
        expect($('.alert-success').html()).toMatch(`Le brouillon de programme ${programName} a bien été supprimé`);
        expect($('.alert-warning').length).toBe(0);
        expect($('.alert-danger').length).toBe(0);


    });

    it(' 3.0 : delete program non auth : should return to the home page', async () => {

        const testSession = session(app);


        const program = await Program.findOne();
        const programId = program.id;
        const programDraftId = program.programDraftId;

        const res = await testSession.get('/program/'+programId+'/delete').redirects(1);

        const programDraftOrNull = await ProgramDraft.findOne({ where : { id : programDraftId }});
        const programOrNull = await Program.findOne({ where : { id : programId}});
        const $ = cheerio.load(res.text);
        
        expect(res.req.path).toEqual('/');
        expect(programOrNull).toBeInstanceOf(Program);
        expect(programDraftOrNull).toBeInstanceOf(ProgramDraft);

    });

     it(' 3.1 : delete program auth non premium user : should return to the home page', async () => {

        const [testSession, user] = await authNonPremiumUser();

       const program = await Program.findOne();
       const programId = program.id;
       const programDraftId = program.programDraftId;

        const res = await testSession.get('/program/'+programId+'/delete').redirects(1);

        const programDraftOrNull = await ProgramDraft.findOne({ where : { id : programDraftId }});
        const programOrNull = await Program.findOne({ where : { id : programId}});
        const $ = cheerio.load(res.text);
        
        expect(res.req.path).toEqual('/');
        expect(programOrNull).toBeInstanceOf(Program);
        expect(programDraftOrNull).toBeInstanceOf(ProgramDraft);

    });

    it(' 3.2 : delete program auth premium user: should return to the home page', async () => {

        const [testSession, user] = await authPremiumUser();

        const program = await Program.findOne();
        const programId = program.id;
        const programDraftId = program.programDraftId;

        const res = await testSession.get('/program/'+programId+'/delete').redirects(1);

        const programDraftOrNull = await ProgramDraft.findOne({ where : { id : programDraftId }});
        const programOrNull = await Program.findOne({ where : { id : programId}});
        const $ = cheerio.load(res.text);
        
        expect(res.req.path).toEqual('/');
        expect(programOrNull).toBeInstanceOf(Program);
        expect(programDraftOrNull).toBeInstanceOf(ProgramDraft);

    });

    it(' 3.3 : delete program auth admin : should delete only program return to the train admin page', async () => {

        const testSession = await authAdmin();

        const program = await Program.findOne();
        const programId = program.id;
        const programDraftId = program.programDraftId;
        const programName = program.name;

        const res = await testSession.get('/program/'+programId+'/delete').redirects(1);

        const programDraftOrNull = await ProgramDraft.findOne({ where : { id : programDraftId }});
        const nullOrProgram = await Program.findOne({ where : { id : programId}});
        const $ = cheerio.load(res.text);
        
        expect(res.req.path).toEqual('/admin/train');
        expect(nullOrProgram).not.toBeInstanceOf(Program);
        expect(programDraftOrNull).toBeInstanceOf(ProgramDraft);
        expect($('.alert-success').html()).toMatch(`Le programme ${programName} a bien été supprimé`);
        expect($('.alert-warning').length).toBe(0);
        expect($('.alert-danger').length).toBe(0);

    });


});

module.exports = programTest;
