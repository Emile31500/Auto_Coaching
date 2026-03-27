const express = require('express');
const { Exercise, ExerciseTrain, ExerciseTrainDraft, Program, ProgramDraft, Train, TrainDraft} = require('../../models/');
const { publishTrain } = require('../../services/train');
const router = express.Router();
const parserJson = require('../../middlewares/parserJson');
const { Op } = require('sequelize');
const multer = require('multer')
const path = require('path');
const adminCheckerApi = require('../../middlewares/adminCheckerApi');
const adminChecker = require('../../middlewares/adminChecker');;

const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E4);
const finalName = 'program-image-' + uniqueSuffix;
let fileFullName = ''
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/media/photo/')
    },
    filename: function (req, file, cb) {
        fileFullName = finalName + '.png'
        cb(null, fileFullName )

    }
})
const upload = multer({ storage : storage });

router.get('/program-draft/:id/delete', adminChecker, async(req, res) => {

    try {

        const id = req.params.id
        const programDraft = await ProgramDraft.findOne({where : {
            id : id
        }})

        const program = await Program.findOne({where : {
            programDraftId : id
        }})

        const programName = programDraft.name;
        await program.destroy();
        await programDraft.destroy();

        req.flash('success', `Le brouillon de programme ${programName} a bien été supprimé`);

    } catch (error) {

        req.flash('danger', error.message)
    }

    res.redirect('/admin/train')

})

router.get('/program/:id/delete', adminChecker, async(req, res) => {

    try {

        const id = req.params.id
        const program = await Program.findOne({where : {
            id : id
        }})

        const programName = program.name;
        await program.destroy();

        req.flash('success', `Le programme ${programName} a bien été supprimé`);

    } catch (error) {

        req.flash('danger', error.message)
    }

    res.redirect('/admin/train')

})

router.get('/admin/program-draft/create', adminChecker, async(req, res) => {

    res.locals.message = req.flash();
    res.render('../views/admin/program-create',  {
        page : '/train',
        layout: '../views/main-admin' 
    });

})

router.get('/program-draft/:idP/train/:idT/edit', adminChecker, async(req, res) => {


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
            },
        },
        order: [
            [TrainDraft, 'ordering', 'ASC']
        ],
        where : {
            id : idP
        }
    })

    console.log(programDraft.TrainDrafts)

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

router.get('/program-draft/:idP/train/:idT/delete', adminChecker, async(req, res) => {

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

router.post('/admin/program-draft/create', parserJson, adminChecker, upload.single('imageUrl'), async(req, res) => {

    try {

        const rawData = req.body;

        const porgramDraft = await ProgramDraft.create({
            name : rawData.name,
            imageUrl : fileFullName,
            description : rawData.description,
        })

        const trainDraft = await TrainDraft.create({
            programDraftId : programDraft.id,
            ordering : 0
        });

        req.flash('success', `Votre programme ${porgramDraft.name} a bien été sauvegardé.`)


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

router.get('/admin/train', adminChecker, async (req, res) => {

    const programDraft = await ProgramDraft.findAll({ include : {
        model : TrainDraft,
        include : {
            model : ExerciseTrainDraft,
            required : false
        },  
        required : false,
        order: [
            [TrainDraft, 'ordering', 'ASC']
        ],

    }});

    const programs = await Program.findAll({ include : {
        model : Train,
        include : {
            model : ExerciseTrain,
            required : false
        },  
        required : false,
        order: [
            [Train, 'ordering', 'ASC']
        ],
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

router.post('/program-draft/:idP/train/:idT/edit', parserJson, adminChecker, upload.single('imageUrl'), async(req, res) => {

    try {

        const idP = req.params.idP;
        const idT = req.params.idT;
        const rawData = req.body;


        const programDraft = await ProgramDraft.findOne({ where : {
            id : idP
        }})
        await programDraft.update({
            imageUrl : fileFullName,
            name : rawData.programName,
            description : rawData.description,
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

            const tranDrafts = await TrainDraft.findAll({where : { programDraftId : programDraft.id }})
            const newTrainDraft = await TrainDraft.create({
                programDraftId : programDraft.id,
                ordering : tranDrafts.length
            });
            res.redirect(`/program-draft/${programDraft.id}/train/${newTrainDraft.id}/edit`)

        }

    } catch (error) {

        req.flash('danger', error.message)

    }

    res.redirect('/program-draft/id/train/id/edit')

})


router.get('/program-draft/:id/publish', adminChecker, async(req, res) => {

    try {

        const id = req.params.id

        const programOrErrorMessage = await publishTrain(id)

        console.log(programOrErrorMessage)
        if (programOrErrorMessage instanceof Program) {
            req.flash('success', `Le programme ${programOrErrorMessage.name} a bien été publié`);
        } else {
            throw new Error(programOrErrorMessage)
        }


    } catch (error) {

        req.flash('danger', error.message)
    }
    
    res.redirect('/admin/train')

})

router.get('/program-draft/:idP/train-draft/:idT/put-prevent', adminChecker, async(req, res) => {

    try {

        const idT = req.params.idT
        const idP = req.params.idP

        const trainDraft = await TrainDraft.findOne({
            include : {
                model : ProgramDraft,
                required : true,
                where : {
                    id : idP
                }
            },
            where : {
                id : idT
            }
        })

        const preventTrainDraft = await TrainDraft.findOne({
            include : {
                model : ProgramDraft,
                required : true,
                where : {
                    id : idP
                }
            },
            where : {
                ordering : { [Op.lt] : trainDraft.ordering},
            },
            order :[['ordering', 'DESC']] 
        })

        const newOrdeing = preventTrainDraft.ordering
        const preventOrdeing = trainDraft.ordering

        preventTrainDraft.ordering = preventOrdeing
        trainDraft.ordering = newOrdeing

        await preventTrainDraft.save()
        await trainDraft.save()

        res.redirect(`/program-draft/${idP}/train/${idT}/edit`)

    } catch (error) {

        req.flash('danger', error.message)
        res.redirect('/admin/train')

    }
})

router.get('/program-draft/:idP/train-draft/:idT/put-next', adminChecker, async(req, res) => {

    try {

        const idT = req.params.idT
        const idP = req.params.idP

        const trainDraft = await TrainDraft.findOne({
            include : {
                model : ProgramDraft,
                required : true,
                where : {
                    id : idP
                }
            },
            where : {
                id : idT
            }
        })

        const nextTrainDraft = await TrainDraft.findOne({
            include : {
                model : ProgramDraft,
                required : true,
                where : {
                    id : idP
                }
            },
            where : {
                ordering : { [Op.gt] : trainDraft.ordering},
            },
            order :[['ordering', 'ASC']] 
        })

        const newOrdeing = nextTrainDraft.ordering
        const preventOrdeing = trainDraft.ordering

        nextTrainDraft.ordering = preventOrdeing
        trainDraft.ordering = newOrdeing

        await nextTrainDraft.save()
        await trainDraft.save()

        res.redirect(`/program-draft/${idP}/train/${idT}/edit`)

    } catch (error) {

        req.flash('danger', error.message)
        res.redirect('/admin/train')

    }
})

module.exports = router;
