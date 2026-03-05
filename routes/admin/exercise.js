const express = require('express');
const { Exercise, ExerciseTrainDraft, ProgramDraft, TrainDraft } = require('../../models');
var parserJson = require('../../middlewares/parserJson');
var adminCheckerApi = require('../../middlewares/adminCheckerApi');
const multer  = require('multer');
const path = require('path');
const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E4);
const finalName = 'exercise-image-' + uniqueSuffix;
let fileFullName = ''
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/media/photo/')
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        fileFullName = (finalName + ext) 
        cb(null, fileFullName)
    }
})
const upload = multer({ storage : storage });

const router = express.Router();

router.get('/program/:idP/train/:idT/exercise/:idE/delete', async (req, res) => {

    try {

        const idP = req.params.idP;
        const idT = req.params.idT;
        const idE = req.params.idE;

        const exerciseTrainDraft = await ExerciseTrainDraft.findOne({
            include : [{
                model : TrainDraft,
                where : {
                    id : idT
                },
                include : {
                    model : ProgramDraft,
                    where : {
                        id : idP
                    }
                }
            }, {
                model : Exercise
            }],
            where : {
                id : idE,
            }
        })

        console.log(exerciseTrainDraft)
        const exerciseName = exerciseTrainDraft.Exercise.name;
        const trainName = exerciseTrainDraft.TrainDraft.name;
        const programName = exerciseTrainDraft.TrainDraft.ProgramDraft.name;

        await exerciseTrainDraft.destroy();
        req.flash('success', `L exercice ${exerciseName} du programme ${programName} a bien été supprimé`);
        res.redirect(`/program/${idP}/train/${idT}/edit`)

    } catch (error) {

        req.flash('danger', error.message)
        res.redirect('/admin/train')
    }
})

router.get('/admin/exercise/id/delete', async(req, res) => {

    try {

        req.flash('success', 'L exercice ${exercice.libele} a bien été supprimé');

    } catch (error) {

        req.flash('danger', error.message)
    }

    res.redirect('/admin/train')

})

router.post('/admin/exercise', parserJson,  upload.single('imageUrl'), async(req, res) => {

    try {

        const rawData = req.body;

        const exercise = await Exercise.create({
            name : rawData.name,
            imageUrl : fileFullName,
        })

        req.flash('success', `Le exercice ${exercise.name} a bien été créé`);


    } catch (error) {

        req.flash('danger', error.message)
    }

    res.redirect('/admin/train')

})

router.post('/program/:idP/train/:idT/exercise', parserJson, async(req, res) => {

    try {

        const idP = req.params.idP
        const idT = req.params.idT
        const rawData = req.body;

        const programDraft = await ProgramDraft.findOne({
            where : {
                id : idP
            }
        })

        const trainDraft = await TrainDraft.findOne({
            where : {
                id : idT,
                programDraftId : programDraft.id
            }
        })

        const exerciseTrainDraft = await ExerciseTrainDraft.create({
            exerciseId : rawData.exerciseId,
            trainDraftId : trainDraft.id,
            reps : rawData.reps,
            repsMode : rawData.repsMode,
            sets : rawData.sets
        })


        req.flash('success', `L'exercice ${exerciseTrainDraft.name} a bien été ajouté à l'entraînement ${trainDraft.name} du programme ${programDraft.name}.`)
        res.redirect(`/program/${programDraft.id}/train/${trainDraft.id}/edit`)

    } catch (error) {

        req.flash('danger', error.message)
        res.redirect('/admin/train')

    }

})

module.exports = router
