const session = require('supertest-session');
const cheerio = require("cheerio");
const app = require('../app')
const { authPremiumUser, authNonPremiumUser, authAdmin, generateRandomString } = require('./test.tools');
const { Curse, CurseDraft, Session, SessionDraft, SessionBibliographyDraft } = require('../models')
const { Op, fn, col, Sequelize } = require('sequelize');

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

    function generateRawDataSessionDraft(typeSUbmit) {

        const uIdNBiblio = generateRandomString(5)

        const rawDataSessionDraft = {
            libele : 'Libele curse : '+generateRandomString(5),
            videoUrl : 'video_'+generateRandomString(5)+ '.mp4',
            bibliography_urls : [
                'https://name.dom/'+uIdNBiblio+'/1',
                'https://name.dom/'+uIdNBiblio+'/2',
                'https://name.dom/'+uIdNBiblio+'/3'
            ],
            bibliography_libeles : [
                'Libele biblio : '+uIdNBiblio+' n° 1',
                'Libele biblio : '+uIdNBiblio+' n° 2',
                'Libele biblio : '+uIdNBiblio+' n° 3'
            ],
            bibliography_isDeleted : [
                'true',
                null,
                null
            ],
            buttonSelected : typeSUbmit ?? 'Sauvegarder & Suivant'
        }

        return rawDataSessionDraft

    }

   /* it(' 1.0: test create curse with non auth user : should return 404', async () => {
        
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

    });*/

    it(' 3 : save and prevent session draft auth admin : should save the session and return to prevent', async () => {


        const testSession = await authAdmin();

        const curseDraft = await CurseDraft.findOne({
            include: [
                {
                    model: SessionDraft,
                    required: true,
                    having: Sequelize.where(
                        fn('COUNT', col('SessionDrafts.id')),
                        { [Op.gt]: 1 }
                    )
                },
                
            ],
            order : [[{model : SessionDraft}, 'ordering', 'ASC']]
           
        });

        const idC = curseDraft.id;
        const sessionDrafts = curseDraft.SessionDrafts;
        const initialSessionDraftLength = sessionDrafts.length
        const sessionDraftLibele = sessionDrafts[1].libele

        const newRawData = generateRawDataSessionDraft('Sauvegarder & Précédent')

        const resGet = await testSession
            .get(`/admin/curse/${curseDraft.id}/session/${sessionDrafts[1].id}`)
            .redirects(1);

        const resPost = await testSession
            .post(`/admin/curse/${curseDraft.id}/session/${sessionDrafts[1].id}`)
            .send(newRawData)
            .redirects(1);
        
        const $Post = cheerio.load(resPost.text);
        const $Get = cheerio.load(resGet.text);


        const newCurseDraft = await CurseDraft.findOne({
            include: [
                {
                    model: SessionDraft,
                    required: true
                }
            ],
            order : [[{model : SessionDraft}, 'ordering', 'ASC']],
            where : {
                id : idC
            }
           
        });

        const newSessionDraftLength = newCurseDraft.SessionDrafts.length
        expect(resPost.req.path).toMatch(`/admin/curse/${curseDraft.id}/session/${sessionDrafts[0].id}`);
        expect(curseDraft.id).toEqual(newCurseDraft.id);
        expect(initialSessionDraftLength).toEqual(newSessionDraftLength);
        expect($Post('.alert-success').text()).toMatch((`La session "${newRawData.libele}" a bien été enregistré`))
        expect(sessionDraftLibele).not.toEqual(newRawData.libele)
        expect($Post('.alert-danger').length).toBe(0)
        expect($Post('.alert-warning').length).toBe(0)
        expect($Get('input[type="submit"][value="Sauvegarder & Précédent"]').length).toBe(1)


    });

    it(' 4.0 : get detail session auth premium user : test presence of element', async () => {


        const [testSession, user] = await authPremiumUser();

        const curse = await Curse.findOne({
            include: [
                {
                    model: SessionDraft,
                    required: true,
                    having: Sequelize.where(
                        fn('COUNT', col('Sessions.id')),
                        { [Op.gt]: 1 }
                    )
                },
                
            ],
            order : [[{model : Session}, 'ordering', 'ASC']],
            where : {
                dependantCurseId : null
            }
           
        });

        const sessions = curse.Sessions;
        const res = await testSession
            .get(`/curse/${curse.id}/session/${sessions[0].id}`)
            .redirects(1);
        
        const $ = cheerio.load(res.text);

        expect(res.req.path).toMatch(`/curse/${curse.id}/session/${sessions[0].id}`);
        expect($(`form[action="/curse/${curse.id}/session/${sessions[0].id}"][method="POST"]`).length).toBe(0)
        expect($('input[name="isThisSessionViewed"]').length).toBe(1)
        expect($('input[type="submit"][value="Sauvegarder & Précédent"]').length).toBe(1)
        expect($('input[type="submit"][value="Sauvegarder"]').length).toBe(0)
        expect($('input[type="submit"][value="Sauvegarder & Suivant"]').length).toBe(0)
    });

    it(' 4.1 : get detail session auth admin : test if precedent button is hidden on curse ', async () => {


        const testSession = await authAdmin();

        const curseDraft = await CurseDraft.findOne({
            include: [
                {
                    model: SessionDraft,
                    required: true,
                    having: Sequelize.where(
                        fn('COUNT', col('SessionDrafts.id')),
                        { [Op.gt]: 1 }
                    )
                },
                
            ],
            order : [[{model : SessionDraft}, 'ordering', 'ASC']]
           
        });
        
        const sessionDrafts = curseDraft.SessionDrafts;
        const res = await testSession
            .get(`/admin/curse/${curseDraft.id}/session/${sessionDrafts[0].id}`)
            .redirects(1);
        
        const $ = cheerio.load(res.text);

        expect(res.req.path).toMatch(`/admin/curse/${curseDraft.id}/session/${sessionDrafts[0].id}`);
        expect($(`form[action="/admin/curse/${curseDraft.id}/session/${sessionDrafts[0].id}"][method="POST"]`).length).toBe(1)
        expect($('input[name="isThisSessionViewed"]').length).toBe(0)
        expect($('input[type="submit"][value="Sauvegarder & Précédent"]').length).toBe(0)
        expect($('input[type="submit"][value="Sauvegarder"]').length).toBe(1)
        expect($('input[type="submit"][value="Sauvegarder & Suivant"]').length).toBe(1)
    });

    it(' 5 : save session draft auth admin : should save the session', async () => {


        const testSession = await authAdmin();

        const curseDraft = await CurseDraft.findOne({
            include: [
                {
                    model: SessionDraft,
                    required: true,
                    having: Sequelize.where(
                        fn('COUNT', col('SessionDrafts.id')),
                        { [Op.gt]: 1 }
                    )
                },
                
            ],
            order : [[{model : SessionDraft}, 'ordering', 'ASC']]
           
        });

        const idC = curseDraft.id;
        const sessionDrafts = curseDraft.SessionDrafts;
        const initialSessionDraftLength = sessionDrafts.length
        const sessionDraftLibele = sessionDrafts[1].libele

        const newRawData = generateRawDataSessionDraft('Sauvegarder')

        const res = await testSession
            .post(`/admin/curse/${curseDraft.id}/session/${sessionDrafts[0].id}`)
            .send(newRawData)
            .redirects(1);
        
        const $ = cheerio.load(res.text);


        const newCurseDraft = await CurseDraft.findOne({
            include: [
                {
                    model: SessionDraft,
                    required: true
                }
            ],
            order : [[{model : SessionDraft}, 'ordering', 'ASC']],
            where : {
                id : idC
            }
           
        });

        const newSessionDraftLength = newCurseDraft.SessionDrafts.length
        expect(res.req.path).toMatch(`/admin/curse/${curseDraft.id}/session/${sessionDrafts[0].id}`);
        expect(curseDraft.id).toEqual(newCurseDraft.id);
        expect(initialSessionDraftLength).toEqual(newSessionDraftLength);
        expect($('.alert-success').text()).toMatch((`La session "${newRawData.libele}" a bien été enregistré`))
        expect(sessionDraftLibele).not.toEqual(newRawData.libele)
        expect($('.alert-danger').length).toBe(0)
        expect($('.alert-warning').length).toBe(0)
    });

    it(' 6.0 : test publish curse non auth : should return a 404 error', async () => {

        const testSession = await session(app);

        const curseDraft = await findCurseDraftNotPublished()

        const url = `/admin/curse/${curseDraft.id}/publish`

        const res = await testSession
            .get(url)
            .redirects(1);

        const $ = cheerio.load(res.text)

         const curse = await Curse.findOne({ 
            where : {
                curseDraftId : curseDraft.id
            }
        })

        expect(curseDraft).toBeInstanceOf(CurseDraft);
        expect(curse).not.toBeInstanceOf(Curse);
        expect(res.req.path).toMatch(url);
        expect(res.statusCode).toEqual(404);
        expect($('.alert-success').length).toEqual(0);
        expect($('.alert-warning').length).toEqual(0);
        expect($('.alert-danger').length).toEqual(0);

    });

    it(' 6.1 : test publish curse non premium user auth : should return a 404 error', async () => {

        const [testSession, user] = await authNonPremiumUser();

        const curseDraft = await findCurseDraftNotPublished()

        const url = `/admin/curse/${curseDraft.id}/publish`

        const res = await testSession
            .get(url)
            .redirects(1);

        const $ = cheerio.load(res.text)

         const curse = await Curse.findOne({ 
            where : {
                curseDraftId : curseDraft.id
            }
        })

        expect(curseDraft).toBeInstanceOf(CurseDraft);
        expect(curse).not.toBeInstanceOf(Curse);
        expect(res.req.path).toMatch(url);
        expect(res.statusCode).toEqual(404);
        expect($('.alert-success').length).toEqual(0);
        expect($('.alert-warning').length).toEqual(0);
        expect($('.alert-danger').length).toEqual(0);

    });

    it(' 6.2 : test publish curse premium user auth : should return a 404 error', async () => {

        const [testSession, user] = await authPremiumUser();

        const curseDraft = await findCurseDraftNotPublished()

        const url = `/admin/curse/${curseDraft.id}/publish`

        const res = await testSession
            .get(url)
            .redirects(1);

        const $ = cheerio.load(res.text)

         const curse = await Curse.findOne({ 
            where : {
                curseDraftId : curseDraft.id
            }
        })

        expect(curseDraft).toBeInstanceOf(CurseDraft);
        expect(curse).not.toBeInstanceOf(Curse);
        expect(res.req.path).toMatch(url);
        expect(res.statusCode).toEqual(404);
        expect($('.alert-success').length).toEqual(0);
        expect($('.alert-warning').length).toEqual(0);
        expect($('.alert-danger').length).toEqual(0);

    });

    it(' 6.3 : test publish curse premium user auth : should publish', async () => {

        const testSession = await authAdmin();
        const curseDraft = await findCurseDraftNotPublished()

        const nullOrCurse = await Curse.findOne({ 
            where : {
                curseDraftId : curseDraft.id
            }
        })

        expect(nullOrCurse).not.toBeInstanceOf(Curse);

        const url = `/admin/curse/${curseDraft.id}/publish`
        const res = await testSession
            .get(url)
            .redirects(1);

        const $ = cheerio.load(res.text)

        const curse = await Curse.findOne({ 
            where : {
                curseDraftId : curseDraft.id
            }
        })

        expect($('.alert-success').text()).toMatch(`Le cours ${curse.libele} est maintenant visible de tous`);
        expect($('.alert-warning').length).toEqual(0);
        expect($('.alert-danger').length).toEqual(0);
        expect(curseDraft).toBeInstanceOf(CurseDraft);
        expect(curse).toBeInstanceOf(Curse);
        expect(res.req.path).toMatch('/admin/curse');
        expect(res.statusCode).toEqual(200);

    });


    async function findCurseDraftNotPublished() {


        const curseDraftId = await CurseDraft.findOne({ 
            attributes : ['id'],
            include: [
                {
                    model: Curse,
                    required: false, // LEFT JOIN
                },
            ], 
            where: {
                '$Curse.id$':  {
                    [Op.is]: null
                } // no related Program
            }
        })

        const curseDraft = await CurseDraft.findOne({ 
            include: [
                {
                    model: SessionDraft,
                    required: false, 
                    include : {
                        model : SessionBibliographyDraft,
                        required: false, 
                    }
                },
            ],
            where: {
                id :  curseDraftId.id
            }
            
        })

        return curseDraft
    }

    async function findCurseDraftPublished() {

        const curseDraft = await CurseDraft.findOne({ 
            include : [
                {
                    model : Curse,
                    required : true,
                }, 
                {
                    model : SessionDraft,
                    required : true,
                    include : {
                        model : SessionBibliographyDraft,
                        required : true
                    }
                }   
            ]
        })

        return curseDraft
        
    }

});

// test creation cours
// test publication cours
// test reorder course

module.exports = curseTest
