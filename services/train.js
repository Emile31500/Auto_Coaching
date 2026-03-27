const { Train, TrainDraft, Program, ProgramDraft, Exercise, ExerciseTrain,ExerciseTrainDraft } = require('../models');
const { Op } = require('sequelize');


const publishTrain = async (id) => {
    try {
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
                require : false,
                include : {
                    model : ExerciseTrain,
                    include : {
                        model : Exercise
                    }
                }
            },
            where : {
                programDraftId : id
            }
        })

        if (!(program instanceof Program)) program = await Program.create({programDraftId : id});

        await program.update({
            name : programDraft.name,
            imageUrl : programDraft.imageUrl,
            description : programDraft.description
        })

        await program.save();

        program.Trains?.forEach(async (train) => {await train.destroy()}) 

        programDraft.TrainDrafts.forEach(async(trainDraft) => {

            let train = await Train.create({
                name : trainDraft.name,
                description :  trainDraft.description,
                programId :  program.id,
                ordering : trainDraft.ordering
            }) 

            trainDraft.ExerciseTrainDrafts.forEach(async(exerciseTrainDraft) => {
                await ExerciseTrain.create({
                    exerciseId : exerciseTrainDraft.exerciseId,
                    trainId : train.id,
                    reps : exerciseTrainDraft.reps,
                    repsMode : exerciseTrainDraft.repsMode,
                    sets : exerciseTrainDraft.sets,
                    ordering : exerciseTrainDraft.ordering
                })

            })
        });

        return program;

    } catch (error) {

        console.log(error.message)
        return error.message;

    }
   
    

}

module.exports = {
  publishTrain,
};