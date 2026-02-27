const express = require('express');
const { Exercise } = require('../models');
var parserJson = require('../middlewares/parserJson');
var authenticationCheckerApi = require('../middlewares/authenticationChecker')
var adminCheckerApi = require('../middlewares/adminCheckerApi');
const premiumChecker = require('../middlewares/premiumChecker');
const router = express.Router();

router.get('/program/id/train/exercise/id/delete', async (req, res) => {

    try {

        req.flash('success', 'L exercice ${exercice.name} du programme ${program.name} a bien été supprimé');

    } catch (error) {

        req.flash('danger', error.message)
    }

    res.redirect('/program/id/train/id/edit')
    
})

router.get('/admin/exercise/id/delete', async(req, res) => {

    try {

        req.flash('success', 'L exercice ${exercice.libele} a bien été supprimé');

    } catch (error) {

        req.flash('danger', error.message)
    }

    res.redirect('/admin/train')

})

router.post('/admin/exercise', parserJson, async(req, res) => {

    try {

        const rawData = req.body;
        req.flash('success', 'Le exercice ${exercice.name} a bien été créé');

    } catch (error) {

        req.flash('danger', error.message)
    }

    res.redirect('/admin/train')

})

router.post('/program/id/train/id/exercise', parserJson, async(req, res) => {

    try {

        const rawData = req.body;
        req.flash('success', "L'exercice ${exercise.name} a bien été ajouté à l'entraînement ${train.name} du programme ${program.name}.")

    } catch (error) {

        req.flash('danger', error.message)

    }

    res.redirect('/program/id/train/id/edit')

})

module.exports = router
