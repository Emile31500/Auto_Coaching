const session = require('supertest-session');
const cheerio = require("cheerio");
const app = require('../app')
const { authPremiumUser, authNonPremiumUser, authAdmin, generateRandomString } = require('./test.tools');
const { Curse, CurseDraft, SessionDraft, SessionBibliographyDraft } = require('../models')
const { Op } = require('sequelize');

const curseTest = describe('Curse tests', () => {
     
    const rawData = {
        libele : 'Curse ' + generateRandomString(5),
        imageUrl : 'placeholder.png',
        description : generateRandomString(5) + ' ' + generateRandomString(5),
    }

    const rawDataSessionDraft = {
        libele : 'Libele curse : '+generateRandomString(5),
        videoUrl : 'video_'+generateRandomString(5)+ '.mp4',
         bibliography_urls : [
            'https://name.dom/1',
            'https://name.dom/2',
            'https://name.dom/3'
        ],
        bibliography_libeles : [
            'Libele biblio n° 1',
            'Libele biblio n° 2',
            'Libele biblio n° 3'
        ],
        bibliography_isDeleted : [
            'true',
            null,
            null
        ],
        buttonSelected : 'Sauvegarder & Suivant'
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
        expect(curseDraft).toBeInstanceOf(CurseDraft);

        const sessionDrafts = await SessionDraft.findAll({ where : {curseDraftId : curseDraft.id}});
        const sessionDraft = sessionDrafts[0];

        expect($('.alert-success').text()).toMatch(`Le cours ${curseDraft.libele} a bien été créé`)
        expect($('.alert-danger').length).toBe(0)
        expect($('.alert-warning').length).toBe(0)
        expect(curseDrafts.length).toEqual(1);
        expect(sessionDrafts.length).toEqual(1);
        expect(res.req.path).toMatch('/admin/curse/'+curseDraft.id+'/session/'+sessionDraft.id);
    });

    it(' 2.0 : save and next session draft non auth user : should not create session and and return to edit actual session draft', async () => {
        
        const testSession = await session(app)

        const curseDrafts = await CurseDraft.findAll({ where : {
            libele : rawData.libele,
            description : rawData.description
        } });
        const curseDraft = curseDrafts[0];

        const sessionDrafts = await SessionDraft.findAll({ 
            where : {curseDraftId : curseDraft.id},
            order : [['ordering', 'DESC']]
        });
        const sessionDraft = sessionDrafts[0];
        const sessionDraftslLength = sessionDrafts.length; 

        const res = await testSession
            .post('/admin/curse/'+curseDraft.id+'/session/'+sessionDraft.id)
            .send(rawDataSessionDraft)
            .redirects(1);

        const $ = cheerio.load(res.text);

         const newSessionDraft = await SessionDraft.findOne({ 
            where : {
                id : {
                    [Op.gt] : curseDraft.id
                },
                curseDraftId : curseDraft.id,
                ordering : {
                    [Op.gt] : curseDraft.ordering
                },
            },
            order : [['ordering', 'DESC']]
        });

        const newCountsessionDrafts = await SessionDraft.findAll({ 
            where : {curseDraftId : curseDraft.id},
            order : [['ordering', 'DESC']]
        });

        expect(res.statusCode).toEqual(404);
        expect(res.req.path).toMatch('/admin/curse/'+curseDraft.id+'/session/'+sessionDraft.id);
        expect(newSessionDraft).not.toBeInstanceOf(SessionDraft);
        expect(newCountsessionDrafts.length).toEqual(sessionDraftslLength);


    });

    it(' 2.1 : save and next session draft auth non premium user : should not create session and and return to edit actual session draft', async () => {
        

        const curseDraft = await CurseDraft.findOne({ where : {
            libele : rawData.libele,
            description : rawData.description
        } });

        const sessionDrafts = await SessionDraft.findAll({ 
            where : {curseDraftId : curseDraft.id},
            order : [
                ['ordering', 'DESC']
            ]
        });
        const sessionDraft = sessionDrafts[0];
        const sessionDraftslLength = sessionDrafts.length; 

        const [testSession, user] = await authNonPremiumUser();
        const res = await testSession
            .post('/admin/curse/'+curseDraft.id+'/session/'+sessionDraft.id)
            .send(rawDataSessionDraft)
            .redirects(1);

        const $ = cheerio.load(res.text);

         const newSessionDraft = await SessionDraft.findOne({ 
            where : {
                id : {
                    [Op.gt] : curseDraft.id
                },
                curseDraftId : curseDraft.id,
                ordering : {
                    [Op.gt] : curseDraft.ordering
                },
            },
            order : [['ordering', 'DESC']]
        });

        const newCountsessionDrafts = await SessionDraft.findAll({ 
            where : {curseDraftId : curseDraft.id},
            order : [['ordering', 'DESC']]
        });

        expect(res.statusCode).toEqual(404);
        expect(res.req.path).toMatch('/admin/curse/'+curseDraft.id+'/session/'+sessionDraft.id);
        expect(newSessionDraft).not.toBeInstanceOf(SessionDraft);
        expect(newCountsessionDrafts.length).toEqual(sessionDraftslLength);


    });

    it(' 2.2: save and next session draft auth premium user : should not create session and and return to edit actual session draft', async () => {
        
        const [testSession, user] = await authPremiumUser();

        const curseDrafts = await CurseDraft.findAll({ where : {
            libele : rawData.libele,
            description : rawData.description
        } });
        const curseDraft = curseDrafts[0];

        const sessionDrafts = await SessionDraft.findAll({ 
            where : {curseDraftId : curseDraft.id},
            order : [['ordering', 'DESC']]
        });
        const sessionDraft = sessionDrafts[0];
        const sessionDraftslLength = sessionDrafts.length; 

        const res = await testSession
            .post('/admin/curse/'+curseDraft.id+'/session/'+sessionDraft.id)
            .send(rawDataSessionDraft)
            .redirects(1);

        const $ = cheerio.load(res.text);

         const newSessionDraft = await SessionDraft.findOne({ 
            where : {
                id : {
                    [Op.gt] : curseDraft.id
                },
                curseDraftId : curseDraft.id,
                ordering : {
                    [Op.gt] : curseDraft.ordering
                },
            },
            order : [['ordering', 'DESC']]
        });

        const newCountsessionDrafts = await SessionDraft.findAll({ 
            where : {curseDraftId : curseDraft.id},
            order : [['ordering', 'DESC']]
        });

        expect(res.statusCode).toEqual(404);
        expect(res.req.path).toMatch('/admin/curse/'+curseDraft.id+'/session/'+sessionDraft.id);
        expect(newSessionDraft).not.toBeInstanceOf(SessionDraft);
        expect(newCountsessionDrafts.length).toEqual(sessionDraftslLength);


    });


    it(' 2.3: save and next session draft auth admin : should create session and and return to edit new session draft', async () => {
        
        
        const testSession = await authAdmin();

        const curseDrafts = await CurseDraft.findAll({ where : {
            libele : rawData.libele,
            description : rawData.description
        } });
        const curseDraft = curseDrafts[0];

        const sessionDrafts = await SessionDraft.findAll({ 
            where : {curseDraftId : curseDraft.id},
            order : [['ordering', 'DESC']]
        });
        const sessionDraft = sessionDrafts[0];

        const res = await testSession
            .post('/admin/curse/'+curseDraft.id+'/session/'+sessionDraft.id)
            .send(rawDataSessionDraft)
            .redirects(1);

        const $ = cheerio.load(res.text);

        const newSessionDraft = await SessionDraft.findOne({ 
            where : {
                curseDraftId : curseDraft.id,
                id : { [Op.gt] : sessionDraft.id}
            }
        });

        //  const newCountsessionDrafts = await SessionDraft.findAll({ 
        //     where : {curseDraftId : curseDraft.id},
        //     order : [['ordering', 'DESC']]
        // });

        const deletedBibliography = await SessionBibliographyDraft.findOne({ where : {
            sessionDraftId : sessionDraft.id,
            libele : rawDataSessionDraft.bibliography_libeles[0]
        }})

        const bibliography = await SessionBibliographyDraft.findOne({ where : {
            sessionDraftId : sessionDraft.id,
            libele : rawDataSessionDraft.bibliography_libeles[1]
        }})

        expect(res.statusCode).toEqual(200);
        expect(res.req.path).toMatch('/admin/curse/'+curseDraft.id+'/session/'+newSessionDraft.id);
        expect(newSessionDraft).toBeInstanceOf(SessionDraft);
        expect(deletedBibliography).not.toBeInstanceOf(SessionBibliographyDraft);
        expect(bibliography).toBeInstanceOf(SessionBibliographyDraft);

        // expect(newCountsessionDrafts.length +1).toEqual(sessionDraftslLength);
        // newSessionDraft.SessionBibliographyDrafts.forEach(sessionBibliographyDraft => {expect(sessionBibliographyDraft).toBeInstanceOf(SessionBibliographyDraft);});

    });

});

// test creation cours
// test publication cours
// test reorder course

module.exports = curseTest
