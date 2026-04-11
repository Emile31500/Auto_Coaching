const session = require('supertest-session');
const cheerio = require("cheerio");
const app = require('../app')
const { ProgramDraft, Program, Train , ExerciseTrain, TrainDraft, ExerciseTrainDraft, Exercise } = require('../models')
const { authAdmin, authPremiumUser, authNonPremiumUser } = require('./test.tools');

const exerciseTrainTest = describe('Trains tests', () => {

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

        const url = '/program-draft/'+programDraft.id+ '/publish';
        const res = await testSession.get(url).redirects(1);
        const nullOrProgram = await Program.findOne({ where : { programDraftId : programDraft.id}});
        const $ = cheerio.load(res.text);
        
        // expect($('.alert-warning').html()).toMatch(null);
        // expect($('.alert-danger').html()).toMatch(null);
        // expect($('.alert-success').html()).toMatch(null);

        console.log($('.alert-warning').text())
        console.log($('.alert-danger').text())
        console.log($('.alert-success').text());

        expect(res.statusCode).toEqual(404);
        expect(res.req.path).toEqual(url);
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

        const url = '/program-draft/'+programDraft.id+ '/publish';
        const res = await testSession.get(url).redirects(1);
        const nullOrProgram = await Program.findOne({ where : { programDraftId : programDraft.id}})
        const $ = cheerio.load(res.text);
        
        // expect($('.alert-warning').html()).toMatch(null);
        // expect($('.alert-danger').html()).toMatch(null);
        // expect($('.alert-success').html()).toMatch(null);

        console.log($('.alert-warning').text())
        console.log($('.alert-danger').text())
        console.log($('.alert-success').text());

        expect(res.statusCode).toEqual(404);
        expect(res.req.path).toEqual(url);
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

        const url = '/program-draft/'+programDraft.id+ '/publish';
        const res = await testSession.get(url).redirects(1);
        const nullOrProgram = await Program.findOne({ where : { programDraftId : programDraft.id}})
        const $ = cheerio.load(res.text);
    
        // expect($('.alert-warning').html()).toMatch(null);
        // expect($('.alert-danger').html()).toMatch(null);
        // expect($('.alert-success').html()).toMatch(null);

        console.log($('.alert-warning'))
        console.log($('.alert-danger'))
        console.log($('.alert-success'));

        expect(res.statusCode).toEqual(404);
        expect(res.req.path).toEqual(url);
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
                [TrainDraft, 'ordering', 'ASC']
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
                [Train, 'ordering', 'ASC']
            ],
        })
        const $ = cheerio.load(res.text);


        expect(res.req.path).toEqual('/admin/train');
        expect($('.alert-success').html()).toMatch(' ');
        expect($('.alert-success').html()).toMatch(`Le programme ${programOrNull.name} a bien été publié`);
    
    });/**/
});

module.exports = exerciseTrainTest;
