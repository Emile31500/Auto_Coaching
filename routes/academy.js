const express = require('express');
const { User, Curse, CurseDraft, SessionBibliography, SessionBibliographyDraft, SessionDraft, Session, ViewedCurse, ViewedSession } = require('../models')
const router = express.Router()
const nodemailer = require("nodemailer");
const adminChecker = require('../middlewares/adminChecker');
var parserJson = require('../middlewares/parserJson');
const { Op, where, literal } = require('sequelize');


const multer  = require('multer');
const cursedraft = require('../models/cursedraft');
const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
const finalName = 'curse-image-' + uniqueSuffix;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/media/photo/');
    },
    filename: function (req, file, cb) {
        cb(null, finalName);
    }
})


router.get('/academy', async (req, res) => {

    curses = await Curse.findAll({
        include : [{
            model : Session
        }, {
            model : ViewedCurse,
            where : {
                userId : req.user?.id || 1
            },
            required : false,
        }],
        where : {
            isDeleted : {
                [Op.not] : true
            }
        }

    })

    const viewedCurses = await ViewedCurse.findAll({where : {
        userId : req.user?.id || 1
    }})

    const viewedCursesMapped = viewedCurses.map((viewedCurse) => viewedCurse.Curse);

    res.locals.message = req.flash();
    res.render('../views/academy/index',  { 
        user : req.user, 
        viewedCurses : viewedCurses,
        viewedCursesMapped : viewedCursesMapped,
        isAdmin : false,
        page : '/academy',
        layout: '../views/main' 
    });
})

router.get('/curse/:idC/session/:idS', async (req, res) => {

    const idC = req.params.idC
    const idS = req.params.idS


    const curseOrNull = await Curse.findOne({
        include : [{
            model : Session,
            include : {
                model : ViewedSession,
                where : {
                    userId : req.user?.id || 1
                },
                required : false
            },
        }],
        where :  {
            isDeleted : null,
            id : idC
        },
        order: [[Session, 'id', 'ASC']]
    })

    const sessionOrNull  = await Session.findOne({
        include : [
            SessionBibliography,
        ],
        where :  {
            isDeleted : null,
            curseId : idC,
            id : idS
        }
    })

    if (curseOrNull instanceof Curse && sessionOrNull instanceof Session) {

        res.locals.message = req.flash();
        res.render('../views/academy/detail-curse',  { 
            user : req.user, 
            page : '/academy',
            isAdmin : false,
            curse : curseOrNull,
            session : sessionOrNull,
            layout: '../views/main' 
        });

    } else {
        res.redirect('/academy')

    }

    
})

router.post('/curse/:idC/session/:idS', parserJson, async (req, res) => {

    try {

        const idC = req.params.idC
        const idS = req.params.idS
        const rawData = req.body

        const actCurse = await Curse.findOne({
                include : [{
                    model : Session,
                    where : {
                        isDeleted : null
                    },
                    include : [{
                        model : ViewedSession,
                        where : {
                            userId : req.user?.id || 1
                        }
                    }]

                    
                }],
                where :  {
                    isDeleted : null,
                    id : idC
                }
            })

        const actSession = await Session.findOne({
            include : [SessionBibliography],
            where :  {
                isDeleted : null,
                curseId : idC,
                id : idS
            }
        })

        const viewedSessionOrNull = await ViewedSession.findOne({
            userId : req.user?.id || 1,
            sessionId : actSession.id 
        })

        const nextSessionOrNull = await Session.findOne({
            where :  {
                isDeleted : null,
                id : {
                    [Op.gt] : idS
                }
            }
        })


        if (!(viewedSessionOrNull instanceof ViewedSession)) {
            
            if (rawData.isThisSessionViewed) {

                const viewedSession = await ViewedSession.create({
                    sessionId : actSession.id,
                    userId : req.user?.id || 1
                })

                req.flash('success', `Vous avez terminé la partie "${actSession.libele}" du cours "${actCurse.libele}"`)
            }
        } else {

            req.flash('warning', `Le cours "${actSession.libele}" est déjà terminé."`)

        }

        areAllCursesRead = true;
        actCurse.Sessions.forEach(session => {areAllCursesRead = areAllCursesRead && (session.ViewedSessions.length > 0)})

        if (areAllCursesRead) {

            const viewedCurseOrNull = await ViewedCurse.findOne({ userId : req.user?.id || 1, curseId : actCurse.id});

            if (!(viewedCurseOrNull instanceof ViewedCurse)) {
                await ViewedCurse.create({
                    curseId : actCurse.id,
                    userId : req.user?.id || 1
                })
            }

        } else {

            await ViewedCurse.delete({where : {
                userId : req.user?.id || 1,
                curseId : actCurse.id
            }})

        }
        

        if (nextSessionOrNull instanceof Session){

            res.redirect(`/curse/${actCurse.id}/session/${nextSessionOrNull.id}`) 

        } else {

            res.redirect(`/academy`)

        }
    
    } catch (error) {

        req.flash('danger', error.message)
        res.redirect(`/academy`)

    }
})

router.get('/admin/curse', async (req, res) => {
    //adminChecker, async (req, res) => {

    const cursesDraft = await CurseDraft.findAll({
        include : [{
            model : SessionDraft,
            where : {
                isDeleted : {
                    [Op.not] : true
                }
            }
        }],
        isDeleted : {
            [Op.not] : true
        }
    })


    res.locals.message = req.flash();
    res.render('../views/academy/index',  { 
        user : req.user, 
        isAdmin : true,
        curses : cursesDraft,
        page : '/academy',
        layout: '../views/main-admin' 
    });
})

router.get('/admin/curse/create', async (req, res) => {

    res.locals.message = req.flash()
    res.render('../views/admin/curse/create',  { 
        user : req.user, 
        page : '/admin/curse/create',
        layout: '../views/main-admin' 
    });

})

router.post('/admin/curse/create', parserJson, async (req, res) => {

    try {

        const upload = multer({ storage: storage })

        console.log(User);
        console.log(Curse);

        const rawData = req.body;
        const curseDraft = await CurseDraft.create({
            libele : rawData.libele,
            imageUrl : finalName,
            description : rawData.description
        })

        const sessionDraft = await SessionDraft.create({
            curseDraftId : curseDraft.id,
            libele : 'First session sample'
        })


        req.flash('success', `Le cours ${curseDraft.libele} a bien été créé`)
        res.redirect('/admin/curse');


    } catch (error) {

        req.flash('danger', error.message)
        res.redirect('/admin/curse/create');
    }

})

router.get('/admin/curse/:idC/session/:idS', async (req, res) => {

    try {

        const idC = req.params.idC;
        const idS = req.params.idS;

        
        const curseDraft = await CurseDraft.findOne({
             include : [{
                model : SessionDraft,
                where : {
                    isDeleted : {
                        [Op.not] : true
                    }
                }
            }],
            where :  {
                isDeleted : {
                    [Op.not] : true
                },
                id : idC
            }
        })

        const sessionDraft = await SessionDraft.findOne({
            include : [SessionBibliographyDraft],
            where :  {
                isDeleted : {
                    [Op.not] : true
                },
                curseDraftId : idC,
                id : idS
            }
        })

        const previousSessionDraftOrNull = await SessionDraft.findOne({
            where :  {
                isDeleted : {
                    [Op.not] : true
                },
                curseDraftId : idC,
                id : {
                    [Op.lt] : idS
                }
            }
        })

        const isTherePrevious = previousSessionDraftOrNull instanceof SessionDraft;

        if (sessionDraft.id != idS) throw 'Session invalide';
        if (sessionDraft.curseDraftId != idC) throw 'Session invalide';


        res.locals.message = req.flash();
        res.render('../views/academy/detail-curse',  { 
            user : req.user, 
            isAdmin : true,
            curse : curseDraft,
            session : sessionDraft,
            isTherePrevious : isTherePrevious,
            layout: '../views/main-admin' 
        });

    } catch(error) {

        req.flash('danger', error.message)
        res.redirect('/admin/curse')
    }

   
})

router.post('/admin/curse/:idC/session/:idS', parserJson, async (req, res) => {

    try {

        const rawData = req.body

        const idC = parseInt(req.params.idC)
        const idS = parseInt(req.params.idS)

        console.log(idS)

        const sessionDraft = await SessionDraft.findOne({
            where : {
                id : idS,
                isDeleted : null
            }
        })

        const curseDraft = await CurseDraft.findOne({
            where : {
                id : idC,
                isDeleted : null
            }
        })

        console.log(sessionDraft.id)

        await sessionDraft.update({
            libele : rawData.libele,
            videoUrl : rawData.videoUrl
        })

        // rawData.bibliographies.forEach(async(bibliographyUrl) =>  {
        for (let index = 0; index < rawData.bibliographies.length; index++) {

            sessionBibliographyDraftOrNull = await SessionBibliographyDraft.findOne({
                where : {
                    sessionDraftId : sessionDraft.id,
                    url : rawData.bibliographies[index],
                }
            })

            if (sessionBibliographyDraftOrNull instanceof SessionBibliographyDraft){

                if (sessionBibliographyDraftOrNull.isDeleted) {
                    await sessionBibliographyDraftOrNull.update({
                        libele :  rawData.libele[index],
                        isDeleted : null
                    });
                }

            } else {
                await SessionBibliographyDraft.create({
                    sessionDraftId : sessionDraft.id,
                    libele :  rawData.libele[index],
                    url : rawData.bibliographies[index],
                });
            }

        }//);

        if (rawData.buttonSelected == 'Sauvegarder & Suivant') {

            const nextDraftOrNull = await SessionDraft.findOne({
                    where : {
                        id : { 
                        [Op.gt] : sessionDraft.id 
                    },
                    curseDraftId : sessionDraft.curseDraftId,
                    isDeleted : null
                }
            })

            if (nextDraftOrNull instanceof SessionDraft) {

                nextDraft = nextDraftOrNull

            } else {
                nextDraft = await SessionDraft.create({
                    libele : 'Nouvelle session',
                    curseDraftId : sessionDraft.curseDraftId
                });
            }

            redirectUrl = `/admin/curse/${idC}/session/${nextDraft.id}`


        } else if (rawData.buttonSelected == 'Sauvegarder & Précédent') {

            const previousDraftOrNull = await SessionDraft.findOne({where : {
                    id : {
                        [Op.lt] : idS
                    },
                    curseDraftId : sessionDraft.curseDraftId,
                    isDeleted :  null
                }
            })

            if (previousDraftOrNull instanceof SessionDraft) {

                previousDraft = previousDraftOrNull

            } else {
                previousDraft = await SessionDraft.create();
            }

            redirectUrl = `/admin/curse/${idC}/session/${previousDraft.id}`

        } else if (rawData.buttonSelected == 'Sauvegarder') {
            
            redirectUrl = `/admin/curse`

        } else throw 'Nous ne savons pas comment traiter cette soumission';

        req.flash('success', `La session n°${sessionDraft.libele} a bien été enregistré`)
        res.redirect(redirectUrl)

    } catch(error) {

        req.flash('danger', error.message)
        res.redirect(`/admin/curse`)
        
    }
})

router.get('/admin/curse/:id/publish', async (req, res) => {
    //adminChecker, async (req, res) => {

    try {

        const id =  req.params.id

        const curseDraft = await CurseDraft.findOne({
            include : {
                model : SessionDraft,
                include :  {
                    model : SessionBibliographyDraft
                }
            },   
            where : {
            id : id,
            isDeleted : null
        }})

        const curseOrNull = await Curse.findOne({
            include : [{
                model : Session,
                include :  {
                    model : SessionBibliography
                }
            }],   
            where : {
            curseDraftId : id,
        }})


        if (curseOrNull instanceof Curse) {
            curse = curseOrNull
        } else {
            curse = await Curse.create({
                curseDraftId : id,
            })
        }

        curse.libele=curseDraft.libele,
        curse.description=curseDraft.description,
        curse.imageUrl=curseDraft.imageUrl, 
        curse.isDeleted=null
        await curse.save();

        curseDraft.SessionDrafts.forEach(async(sessionDraft) => {

            const sessionOrNull = await Session.findOne({
                where : {
                    sessionDraftId : sessionDraft.id
                }
            })
            

            if (sessionOrNull instanceof Session) {
                session = sessionOrNull
            } else {
                session = await Session.create({
                    sessionDraftId : sessionDraft.id,
                    curseId : curse.id
                })
            }

            session.libele = sessionDraft.libele,
            session.description = sessionDraft.description,
            session.videoUrl = sessionDraft.videoUrl,
            session.curseId = curse.id,
            session.isDeleted = null
            await session.save()

            sessionDraft.SessionBibliographyDrafts.forEach(async (sessionBibliographyDraft) => {

                 const sessionBibliographyOrNull = await SessionBibliography.findOne({
                    where : {
                    sessionBibliographyDraftId : sessionBibliographyDraft.id,
                }})
                
                if (sessionBibliographyOrNull instanceof SessionBibliographyDraft) {
                    sessionBibliography = sessionBibliographyOrNull
                } else {
                    sessionBibliography = await SessionBibliography.create({
                        sessionId : session.id,
                        sessionBibliographyDraftId : sessionBibliographyDraft.id,
                    })
                }
                sessionBibliographyDraft.libele = sessionBibliographyDraft.libele
                sessionBibliography.url = sessionBibliographyDraft.url
                sessionBibliography.isDeleted = null
                await sessionBibliography.save()
            })/**/
        })

        req.flash('success', `Le cours ${curse.libele} est maintenant visible de tous`)

    } catch (error) {

        req.flash('danger', error.message)

    }
    res.redirect('/admin/curse')
})

router.get('/admin/session/:id/delete', async (req, res) => {

    try{
        
        const id = req.params.id;

        const sessionDraft =  await SessionDraft.findOne({
            where : {
                id : id,
                isDeleted : null
            }
        })

        const sessionDraftOrNull =  await SessionDraft.findOne({
            where : {
                id : {
                    [Op.lt] : id
                },
                isDeleted : null,
                curseDraftId : sessionDraft.curseDraftId
            },
            orderBy : [['id', 'DESC']]
        })

        if(!(sessionDraftOrNull instanceof SessionDraft)) {

            sessionRedirect =  await SessionDraft.findOne({
                where : {
                    id : {
                        [Op.gt] : id
                    },
                    isDeleted : null,
                    curseDraftId : sessionDraft.curseDraftId
                },
                orderBy : [['id', 'ASC']]

            })
        } else {
            sessionRedirect = sessionDraftOrNull
        }

        await session.update({isDeleted : true})
        req.flash('success', `La session ${sessionDraft.libele} a bien été supprimée.`)
        res.redirect(`/admin/curse/${sessionRedirect.curseDraftId}/session/${sessionRedirect.id}`)

    } catch(error) {

        req.flash('danger', error.message)
        res.redirect('/admin/curse')

    }
        

})

router.get('/admin/curse/:id/delete', async (req, res) => {

    try {

        const id = req.params.id

        const curseDraft = await CurseDraft.findOne({
            where : {
                id : id,
                isDeleted : null
            }
        })

        await curseDraft.update({
            isDeleted : true
        })

        const curseOrNull = await Curse.findOne({
            where : {
                curseDraftId : id,
                isDeleted : null
            }
        })

        if (curseOrNull instanceof Curse && curseDraft.isPublished) {
            await curseOrNull.update({
                isDeleted : true
            })
        }

        req.flash('success', 'Le cours ${curse.name} a été supprimé')

    } catch (error) {

        req.flash('danger', error.message)

    }

    res.redirect('/admin/curse')

})

module.exports = router