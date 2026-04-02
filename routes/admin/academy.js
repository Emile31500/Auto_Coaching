const express = require('express');
const { Curse, CurseDraft, SessionBibliography, SessionBibliographyDraft, SessionDraft, Session } = require('../../models')
const { publishCurseDraft } = require ('../../services/academy.js')
const router = express.Router()
const adminChecker = require('../../middlewares/adminChecker');

var parserJson = require('../../middlewares/parserJson');
const { Op} = require('sequelize');


const multer  = require('multer');
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

router.get('/admin/curse', adminChecker, async (req, res) => {
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

router.get('/admin/curse/create', adminChecker, async (req, res) => {

    res.locals.message = req.flash()
    res.render('../views/admin/curse/create',  { 
        user : req.user, 
        page : '/admin/curse/create',
        layout: '../views/main-admin' 
    });

})

router.post('/admin/curse/create', parserJson, adminChecker, async (req, res) => {

    try {

        const upload = multer({ storage: storage })

        const rawData = req.body;
        const curseDraft = await CurseDraft.create({
            libele : rawData.libele,
            imageUrl : finalName,
            description : rawData.description
        })

        const sessionDraft = await SessionDraft.create({
            curseDraftId : curseDraft.id,
            libele : 'First session sample',
            ordering : 0
        })


        req.flash('success', `Le cours ${curseDraft.libele} a bien été créé`)
        res.redirect('/admin/curse/'+curseDraft.id+'/session/'+sessionDraft.id);


    } catch (error) {

        console.log(error)
        req.flash('danger', error.message)
        res.redirect('/admin/curse/create');
    }

})

router.get('/admin/curse/:idC/session/:idS', adminChecker, async (req, res) => {

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
                },
                include :{
                    model : SessionBibliographyDraft,
                    required : false,
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

        if (sessionDraft.id != idS) throw new Error('Session invalide');
        if (sessionDraft.curseDraftId != idC) throw new Error('Session invalide');


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

        console.log(error)
        req.flash('danger', error.message)
        res.redirect('/admin/curse')
    }

   
})

router.post('/admin/curse/:idC/session/:idS', parserJson, adminChecker, async (req, res) => {

    try {

        const rawData = req.body

        if (rawData.bibliography_urls != undefined && rawData.bibliography_libeles != undefined) {
            if (rawData.bibliography_urls.length != rawData.bibliography_libeles.length) {
                throw new Error(`Le nombre d'url (${rawData.bibliography_libeles.length}) et le nombre de titre (${rawData.bibliography_urls.length}) sont différent.`);
            }
        }

        const idC = parseInt(req.params.idC)
        const idS = parseInt(req.params.idS)

        const sessionDraft = await SessionDraft.findOne({
            where : {
                curseDraftId : idC,
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

        await sessionDraft.update({
            libele : rawData.libele,
            videoUrl : rawData.videoUrl
        })

        if (rawData.bibliography_urls != undefined && rawData.bibliography_libeles != undefined) {
           
            for (let index = 0; index < rawData.bibliography_urls.length; index++) {

                const sessionBibliographyDraftOrNull = await SessionBibliographyDraft.findOne({
                    where : {
                        sessionDraftId : sessionDraft.id,
                        url : rawData.bibliography_urls[index],
                    }
                })

                if (sessionBibliographyDraftOrNull instanceof SessionBibliographyDraft){

                    await sessionBibliographyDraftOrNull.update({
                        libele :  rawData.bibliography_libeles[index],
                    });

                    if (rawData.bibliography_isDeleted[index] == 'true') {
                        sessionBibliographyDraftOrNull.isDeleted = true;
                    } else {
                        sessionBibliographyDraftOrNull.isDeleted = null;
                    }

                    await sessionBibliographyDraftOrNull.save()

                } else {
                    if (rawData.bibliography_isDeleted[index] != 'true') {
                        await SessionBibliographyDraft.create({
                            sessionDraftId : sessionDraft.id,
                            libele :  rawData.bibliography_libeles[index],
                            url : rawData.bibliography_urls[index],
                        });
                    } 
                }
            }
        }

        if (rawData.buttonSelected == 'Sauvegarder & Suivant') {

            const nextDraftOrNull = await SessionDraft.findOne({
                    where : {
                    id : { [Op.gt] : sessionDraft.id  },
                    curseDraftId : sessionDraft.curseDraftId,
                    isDeleted : null
                }
            })

            if (nextDraftOrNull instanceof SessionDraft) {

                nextDraft = nextDraftOrNull

            } else {

                orderingSession = await SessionDraft.findOne({
                    attributes: ['ordering'],
                    where : {
                        curseDraftId : curseDraft.id,
                    },
                    order : [['ordering', 'DESC']]
                });
                // console.log(orderingSession)

                nextDraft = await SessionDraft.create({
                    libele : 'Nouvelle session',
                    curseDraftId : sessionDraft.curseDraftId,
                    ordering : orderingSession.ordering+1
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
                previousDraft = sessionDraft;
            }

            redirectUrl = `/admin/curse/${idC}/session/${previousDraft.id}`

        } else if (rawData.buttonSelected == 'Sauvegarder') {
            
            redirectUrl = `/admin/curse/${idC}/session/${sessionDraft.id}`

        } else throw 'Nous ne savons pas comment traiter cette soumission';

        req.flash('success', `La session "${sessionDraft.libele}" a bien été enregistré`)
        res.redirect(redirectUrl)

    } catch(error) {

        console.log(error)
        req.flash('danger', error.message)
        res.redirect(`/admin/curse`)
        
    }
})

router.get('/admin/curse/:id/publish', adminChecker, async (req, res) => {
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


        const curseOrErrorMessage = await publishCurseDraft(curseDraft)
        if (curseOrErrorMessage instanceof Curse) {
            
            req.flash('success', `Le cours ${curseOrErrorMessage.libele} est maintenant visible de tous`)

        } else {

            throw new Error(curseOrErrorMessage)

        }


    } catch (error) {

        console.log(error)
        req.flash('danger', error.message)

    }
    res.redirect('/admin/curse')
})

router.get('/admin/session/:id/delete', adminChecker, async (req, res) => {

    try{
        
        const id = req.params.id;

        const sessionDraft = await SessionDraft.findOne({
            where : {
                id : id,
                isDeleted : null
            }
        })

        const sessionDraftOrNull = await SessionDraft.findOne({
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

        console.log(error)
        req.flash('danger', error.message)
        res.redirect('/admin/curse')

    }
        

})

router.get('/admin/curse/:id/delete', adminChecker, async (req, res) => {

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

        console.log(error)
        req.flash('danger', error.message)

    }

    res.redirect('/admin/curse')

})

module.exports = router