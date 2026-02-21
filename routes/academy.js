const express = require('express');
const { User, Curse, CurseDraft, SessionBibliographyDraft, SessionDraft } = require('../models')
const router = express.Router()
const nodemailer = require("nodemailer");
const adminChecker = require('../middlewares/adminChecker');
var parserJson = require('../middlewares/parserJson');
const { Op, where } = require('sequelize');


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

const biblioGraphyTemp = [
'msdmanuals.com/fr/accueil/troubles-hormonaux-et-métaboliques/biologie-du-système-hormonal/fonction-endocrinienne',
'msdmanuals.com/fr/accueil/troubles-hormonaux-et-m%C3%A9taboliques/biologie-du-syst%C3%A8me-hormonal/fonction-endocrinienne',
'eurofins-biomnis.com/referentiel/liendoc/precis/TESTOSTERONE.pdf',
'rmlg.uliege.be/article/1742',
'frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1308602/full',
'sciencedirect.com/science/article/abs/pii/S0531556521002023',
'jhse.es/index.php/jhse/article/view/combined-training-improves-fitness-cognition-overweight-older-ad/207',
'pubmed.ncbi.nlm.nih.gov/40507091/',
'who.int/westernpacific/about/how-we-work/pacific-support/news/detail/04-03-2024-study-finds-pacific-accounts-for-9-of-the-10-most-obese-countries-in-the-world',
'rmlg.uliege.be/article/1742',
'frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1308602/full',
'sciencedirect.com/science/article/abs/pii/S0531556521002023',
'jhse.es/index.php/jhse/article/view/combined-training-improves-fitness-cognition-overweight-older-ad/207',
'pubmed.ncbi.nlm.nih.gov/40507091/',
'who.int/westernpacific/about/how-we-work/pacific-support/news/detail/04-03-2024-study-finds-pacific-accounts-for-9-of-the-10-most-obese-countries-in-the-world',
'pubmed.ncbi.nlm.nih.gov/33741447/',
'pubmed.ncbi.nlm.nih.gov/35254136/',
'pmc.ncbi.nlm.nih.gov/articles/PMC3880087/',
'anses.fr/fr/content/les-lipides',
'health.harvard.edu/staying-healthy/the-hidden-dangers-of-protein-powders',
'lactalisingredients.com/fr/news/blog/effet-satietogene-des-proteines-laitieres/',
'rmlg.uliege.be/article/1742',
'frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1308602/full',
'sciencedirect.com/science/article/abs/pii/S0531556521002023',
'jhse.es/index.php/jhse/article/view/combined-training-improves-fitness-cognition-overweight-older-ad/207',
'pubmed.ncbi.nlm.nih.gov/40507091/',
'who.int/westernpacific/about/how-we-work/pacific-support/news/detail/04-03-2024-study-finds-pacific-accounts-for-9-of-the-10-most-obese-countries-in-the-world',
'rmlg.uliege.be/article/1742',
'frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1308602/full',
'sciencedirect.com/science/article/abs/pii/S0531556521002023',
'jhse.es/index.php/jhse/article/view/combined-training-improves-fitness-cognition-overweight-older-ad/207',
'pubmed.ncbi.nlm.nih.gov/40507091/',
'who.int/westernpacific/about/how-we-work/pacific-support/news/detail/04-03-2024-study-finds-pacific-accounts-for-9-of-the-10-most-obese-countries-in-the-world']

router.get('/academy', async (req, res) => {

    curses = await Curse.findAll({
        where : {
            isDeleted : {
                [Op.not] : true
            }
        }

    })

    res.locals.message = req.flash();
    res.render('../views/academy/index',  { 
        user : req.user, 
        isAdmin : false,
        page : '/academy',
        layout: '../views/main' 
    });
})

router.get('/curse/session', async (req, res) => {

    res.locals.message = req.flash();
    res.render('../views/academy/detail-curse',  { 
        user : req.user, 
        page : '/academy',
        isAdmin : false,
        biblioGraphyTemp : biblioGraphyTemp,
        layout: '../views/main' 
    });
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

router.get('/admin/curse/:idC/handle/:idS', async (req, res) => {

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

router.post('/admin/curse/:idC/handle/:idS', parserJson, async (req, res) => {

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

        rawData.bibliographies.forEach(async(bibliographyUrl) =>  {

            sessionBibliographyDraftOrNull = await SessionBibliographyDraft.findOne({
                where : {
                    sessionDraftId : sessionDraft.id,
                    url : bibliographyUrl,
                }
            })

            if (sessionBibliographyDraftOrNull instanceof SessionBibliographyDraft){

                if (sessionBibliographyDraftOrNull.isDeleted) {
                    await sessionBibliographyDraftOrNull.update({
                        isDeleted : null
                    });
                }

            } else {
                await SessionBibliographyDraft.create({
                    sessionDraftId : sessionDraft.id,
                    url : bibliographyUrl,
                });
            }

        });

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

            redirectUrl = `/admin/curse/${idC}/handle/${nextDraft.id}`


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

            redirectUrl = `/admin/curse/${idC}/handle/${previousDraft.id}`

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

router.get('/admin/curse/id/publish', async (req, res) => {
    //adminChecker, async (req, res) => {

    try {

        req.flash('success', 'Le cours ${curse.name} est maintenant visible de tous')

    } catch (error) {

        req.flash('danger', error.message)

    }
    res.redirect('/admin/curse')
})

router.get('/admin/curse/id/delete', async (req, res) => {

    try {

        req.flash('success', 'Le cours ${curse.name} a été supprimé')

    } catch (error) {

        req.flash('danger', error.message)

    }

    res.redirect('/admin/curse')

})

module.exports = router