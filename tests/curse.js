const session = require('supertest-session');
const cheerio = require("cheerio");
const app = require('../app')
const { authPremiumUser, authNonPremiumUser, authAdmin, generateRandomString } = require('./test.tools');
const { Curse, CurseDraft, SessionDraft } = require('../models')

const curseTest = describe('Curse tests', () => {
     
    const rawData = {

        libele : 'Curse ' + generateRandomString(5),
        imageUrl : 'placeholder.png',
        description : generateRandomString(5) + ' ' + generateRandomString(5),

    }

    it(' 1.0: test create curse with non auth user : should return 404', async () => {
        
        const testSession = session(app);

        const res = await testSession
            .post('/admin/curse/create')
            .send(rawData)
            .redirects(1);

        const $ = cheerio.load(res.text);

        const curseDraft = await CurseDraft.findOne({ where : {
            libele : rawData.libele,
            description : rawData.description
        } });

        expect(curseDraft).not.toBeInstanceOf(Curse);
        expect(res.req.path).toMatch('/admin/curse/create');
        expect(res.statusCode).toEqual(404);
        expect($('form').length).toBe(0);


    });


    it(' 1.1: test create curse with auth non premium user : should return 404', async () => {
        
        const [testSession, user] = await authNonPremiumUser();


        const res = await testSession
            .post('/admin/curse/create')
            .send(rawData)
            .redirects(1);

        const $ = cheerio.load(res.text);

        const curseDraft = await CurseDraft.findOne({ where : {
            libele : rawData.libele,
            description : rawData.description
        } });

        expect(curseDraft).not.toBeInstanceOf(CurseDraft);
        expect(res.req.path).toMatch('/admin/curse/create');
        expect(res.statusCode).toEqual(404);
        expect($('form').length).toBe(0);


    });

    it(' 1.2: test create curse with auth  premium user : should return 404', async () => {
        
        const [testSession, user] = await authPremiumUser();


        const res = await testSession
            .post('/admin/curse/create')
            .send(rawData)
            .redirects(1);

        const $ = cheerio.load(res.text);

        const curseDraft = await CurseDraft.findOne({ where : {
            libele : rawData.libele,
            description : rawData.description
        } });

        expect(curseDraft).not.toBeInstanceOf(CurseDraft);
        expect(res.req.path).toMatch('/admin/curse/create');
        expect(res.statusCode).toEqual(404);
        expect($('form').length).toEqual(0);


    });

    it(' 1.3 : test create curse with auth admin : should create curse and redirect to edit page', async () => {
        
        const testSession = await authAdmin();

        const res = await testSession
            .post('/admin/curse/create')
            .send(rawData)
            .redirects(1);

        const $ = cheerio.load(res.text);

        const curseDrafts = await CurseDraft.findAll({ where : {
            libele : rawData.libele,
            description : rawData.description
        } });
        const curseDraft = curseDrafts[0];

        const sessionDrafts = await SessionDraft.findAll({ where : {curseDraftId : curseDraft.id}});
        const sessionDraft = sessionDrafts[0];

        expect($('.alert-success').text()).toMatch(`Le cours ${curseDraft.libele} a bien été créé`)
        expect($('.alert-danger').length).toBe(0)
        expect($('.alert-warning').length).toBe(0)
        expect(curseDrafts.length).toEqual(1);
        expect(sessionDrafts.length).toEqual(1);
        expect(curseDraft).toBeInstanceOf(CurseDraft);
        expect(res.req.path).toMatch('/admin/curse/'+curseDraft.id+'/session/'+sessionDraft.id);
    });
});

// test creation cours
// test publication cours
// test reorder course

module.exports = curseTest
