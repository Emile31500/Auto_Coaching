const express = require('express');
const { Exercise, ExerciseTrainDraft, ProgramDraft, TrainDraft} = require('../../models/');
const router = express.Router();
const parserJson = require('../../middlewares/parserJson');


router.get('/program/create', async(req, res) => {

    try {

        req.flash('success', 'Le programme ${program.libele} a bien été publié');

    } catch (error) {

        req.flash('danger', error.message)
    }

    res.locals.message = req.flash();
    res.render('../views/admin/program-create',  {
        page : '/train',
        layout: '../views/main-admin' 
    });

})

router.get('/admin/program/create', async(req, res) => {

    res.locals.message = req.flash();
    res.render('../views/admin/program-create',  {
        page : '/train',
        layout: '../views/main-admin' 
    });

})

router.get('/program/:idP/train/:idT/edit', async(req, res) => {


    const idP = req.params.idP
    const idT = req.params.idT

    const programDraft = await ProgramDraft.findOne({
        include : {
            model : TrainDraft,
            include : {
                model : ExerciseTrainDraft,
            }
        },
        where : {
            id : idP
        }
    })

    const trainDraft = await TrainDraft.findOne({
        include : {
            model : ExerciseTrainDraft,
            include : {
                    model : Exercise,
            },
            requried : false
        },
        where : {
            programDraftId : programDraft.id,
            id : idT
        }
    })

    res.locals.message = req.flash();
    res.render('../views/admin/program',  {
        page : '/train',
        trainDraft : trainDraft,
        programDraft : programDraft,
        layout: '../views/main-admin' 
    });

})

router.get('/program/:idP/train/:idT/delete', async(req, res) => {

    try {

        const idP = req.params.idP
        const idT = req.params.idT

        const programDraft = await ProgramDraft.findOne({where : { id : idP}})

        const trainDraft = await TrainDraft.findOne({where : { 
            id : idT,
            programDraftId : programDraft.id
        }})

        const trainDraftName = trainDraft.name || 'entraînement sans nom';
        await trainDraft.destroy();

        const trainDraftRedirect = await TrainDraft.findOne({
            where : {
                programDraftId : programDraft.id,
                id : {
                    [Op.not] : idT
                }
            },
            orderBy : [['id', 'ASC']]
        })

        req.flash('success', `L'entraînement ${trainDraftName} a bien été supprimé.`)
        res.redirect(`/program/${programDraft.id}/train/${trainDraftRedirect.id}`)

    } catch (error) {
        req.flash('danger', error.message)
    }

    res.redirect(`/admin/train/`)

})

router.post('/admin/program/create', parserJson, async(req, res) => {

    try {

        const rawData = req.body;

        const porgramDraft = await ProgramDraft.create({
            name : rawData.name,
            description : rawData.description,
        })

        const trainDraft = await TrainDraft.create({
            programDraftId : programDraft.id
        });

        req.flash('success', `Votre programme ${porgramDraft.name} a bien été sauvegarder`)


        if (rawData.save === 'Sauvegarder') {

            res.redirect('/admin/train')
        
        } else {

            const trainDraft = await TrainDraft.create();
            res.redirect(`/program/${porgramDraft.id}/train/${trainDraft.id}/edit`)

        }

    } catch (error) {

        req.flash('danger', error.message)

    }

    res.redirect('/program/id/train/id/edit')

})

router.get('/admin/train', async (req, res) => {

    const programDraft = await ProgramDraft.findAll({ include : {
        model : TrainDraft,
        include : {
            model : ExerciseTrainDraft,
            required : false
        },  
        required : false
    }});

    res.locals.message = req.flash();
    res.render('../views/admin/train',  {
        layout: '../views/main-admin',
        programs : programDraft
    });

})

router.post('/program/:idP/train/:idT/edit', parserJson, async(req, res) => {

    try {

        const idP = req.params.idP;
        const idT = req.params.idT;
        const rawData = req.body;


        const programDraft = await ProgramDraft.findOne({ where : {
            id : idP
        }})
        await programDraft.update({
            name : rawData.programName,
        })

        const trainDraft = await TrainDraft.findOne({ where : {
            id : idT,
            programDraftId : programDraft.id
        }})
        await trainDraft.update({
            name : rawData.trainName,
        })

        req.flash('success', `Votre programme ${programDraft.name} a bien été sauvegarder`)


        if (rawData.save === 'Sauvegarder') {

            res.redirect('/admin/train')
        
        } else {

            const newTrainDraft = await TrainDraft.create({programDraftId : programDraft.id});
            res.redirect(`/program/${programDraft.id}/train/${newTrainDraft.id}/edit`)

        }

    } catch (error) {

        req.flash('danger', error.message)

    }

    res.redirect('/program/id/train/id/edit')

})

router.get('/program/id/publish', async(req, res) => {

    try {

        req.flash('success', 'Le programme ${program.libele} a bien été publié');

    } catch (error) {

        req.flash('danger', error.message)
    }

    res.redirect('/admin/train')

})

module.exports = router;
