const express = require('express');
const { User, Curse, CurseDrawft, SessionDraft } = require('../models')
const router = express.Router()
const nodemailer = require("nodemailer");
const adminChecker = require('../middlewares/adminChecker');
var parserJson = require('../middlewares/parserJson');
const { Op, where } = require('sequelize');


const multer  = require('multer');
const cursedrawft = require('../models/cursedrawft');
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

const biblioGraphyTemp = ['msdmanuals.com/fr/accueil/troubles-hormonaux-et-métaboliques/biologie-du-système-hormonal/fonction-endocrinienne',
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

    const cursesDrawfts = await CurseDrawft.findAll({
        isDeleted : {
            [Op.not] : true
        }
    })


    res.locals.message = req.flash();
    res.render('../views/academy/index',  { 
        user : req.user, 
        isAdmin : true,
        curses : cursesDrawfts,
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
        const curseDrawft = await CurseDrawft.create({
            libele : rawData.libele,
            imageUrl : finalName,
            description : rawData.description
        })

        const sessionDraft = await SessionDraft.create({
            curseDraftId : curseDrawft.id,
            libele : 'First session sample'
        })


        req.flash('success', `Le cours ${curseDrawft.libele} a bien été créé`)
        res.redirect('/admin/curse');


    } catch (error) {

        req.flash('danger', error.message)
        res.redirect('/admin/curse/create');
    }

})


router.get('/admin/curse/idC/handle/idS', async (req, res) => {
    //adminChecker, async (req, res) => {

    res.locals.message = req.flash();
    res.render('../views/academy/detail-curse',  { 
        user : req.user, 
        isAdmin : true,
        biblioGraphyTemp : biblioGraphyTemp,
        layout: '../views/main-admin' 
    });
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