const express = require('express');
const { Exercise, ExerciseTrain, ExerciseTrainDraft, Program, ProgramDraft, Train, TrainDraft} = require('../../models/');
const router = express.Router();
const parserJson = require('../../middlewares/parserJson');
const { Op } = require('sequelize');

router.get('/program-draft/:id/delete', async(req, res) => {

    try {

        const id = req.params.id
        const programDraft = await ProgramDraft.findOne({where : {
            id : id
        }})

        const programName = programDraft;
        await programDraft.destroy();

        req.flash('success', `Le brouillon de programme ${programName} a bien été supprimé`);

    } catch (error) {

        req.flash('danger', error.message)
    }

    res.redirect('/admin/train')

})

router.get('/program/:id/delete', async(req, res) => {

    try {

        const id = req.params.id
        const program = await Program.findOne({where : {
            id : id
        }})

        const programName = program;
        await program.destroy();

        req.flash('success', `Le programme ${programName} a bien été supprimé`);

    } catch (error) {

        req.flash('danger', error.message)
    }

    res.redirect('/admin/train')

})


router.get('/program-draft/create', async(req, res) => {

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

router.get('/admin/program-draft/create', async(req, res) => {

    res.locals.message = req.flash();
    res.render('../views/admin/program-create',  {
        page : '/train',
        layout: '../views/main-admin' 
    });

})

router.get('/program-draft/:idP/train/:idT/edit', async(req, res) => {


    const idP = req.params.idP
    const idT = req.params.idT

    const programDraft = await ProgramDraft.findOne({
        include : {
            model : TrainDraft,
            include : {
                model : ExerciseTrainDraft,
                include : {
                    model : Exercise
                }
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

    const exercises = await Exercise.findAll()

    res.locals.message = req.flash();
    res.render('../views/admin/program',  {
        page : '/train',
        exercises : exercises,
        trainDraft : trainDraft,
        programDraft : programDraft,
        layout: '../views/main-admin' 
    });

})

router.get('/program-draft/:idP/train/:idT/delete', async(req, res) => {

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
            orderBy : [['id', 'DESC']]
        })

        req.flash('success', `L'entraînement ${trainDraftName} a bien été supprimé.`)
        res.redirect(`/program-draft/${programDraft.id}/train/${trainDraftRedirect.id}/edit`)

    } catch (error) {
        req.flash('danger', error.message)
    }

    res.redirect(`/admin/train/`)

})

router.post('/admin/program-draft/create', parserJson, async(req, res) => {

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
            res.redirect(`/program-draft/${porgramDraft.id}/train/${trainDraft.id}/edit`)

        }

    } catch (error) {

        req.flash('danger', error.message)

    }

    res.redirect('/program-draft/id/train/id/edit')

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

    const programs = await Program.findAll({ include : {
        model : Train,
        include : {
            model : ExerciseTrain,
            required : false
        },  
        required : false
    }});

    const exercises = await Exercise.findAll();

    res.locals.message = req.flash();
    res.render('../views/admin/train',  {
        layout: '../views/main-admin',
        exercises : exercises,
        programDrafts : programDraft,
        programs : programs
    });

})

router.post('/program-draft/:idP/train/:idT/edit', parserJson, async(req, res) => {

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
            res.redirect(`/program-draft/${programDraft.id}/train/${newTrainDraft.id}/edit`)

        }

    } catch (error) {

        req.flash('danger', error.message)

    }

    res.redirect('/program-draft/id/train/id/edit')

})


router.get('/program-draft/:id/publish', async(req, res) => {

    try {

        const id = req.params.id

        const programDraft = await ProgramDraft.findOne({ 
            include : {
                model : TrainDraft,
                include : {
                    model : ExerciseTrainDraft,
                    include : {
                        model : Exercise
                    }
                }
            },        
            where : {
                id : id
            }
        })

        let program = await Program.findOne({
            include : {
                model : Train,
                require : false
            },
            where : {
                programDraftId : id
            }
        })

       if (!(program instanceof Program)) program = await Program.create({programDraftId : id});

        await program.update({
            name : programDraft.name,
            description : programDraft.description
        })

        program.Trains?.forEach(train => {train.destroy()}) 

        programDraft.TrainDrafts.forEach(async(trainDraft) => {

            let train = await Train.create({
                name : trainDraft.name,
                description :  trainDraft.description,
                programId :  program.id
            }) 

            trainDraft.ExerciseTrainDrafts.forEach(async(exerciseTrainDraft) => {
                let exerciseTrain = await ExerciseTrain.create({
                    exerciseId : exerciseTrainDraft.exerciseId,
                    trainId : train.id,
                    reps : exerciseTrainDraft.reps,
                    repsMode : exerciseTrainDraft.repsMode,
                    sets : exerciseTrainDraft.sets,
                })

            })
        });

        req.flash('success', `Le programme ${program.name} a bien été publié`);

    } catch (error) {

        req.flash('danger', error.message)
    }
    return false;
    // res.redirect('/admin/train')

})

module.exports = router;
