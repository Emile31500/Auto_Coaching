async function parseTrain() {

    let rest = await getOneExercise(8);
    const trainExercises = await getExerciseOfThisDay(trainId.innerHTML, dayValue.innerHTML);
    dayValue.remove()
    trainId.remove()
    let fullTrain = [];

    for (let index = 0; index < trainExercises.length; index++) {
        
        const trainExercise = trainExercises[index];
        let exercise = await getOneExercise(trainExercise.exerciseId);

        for (let indexSets = 0; indexSets < trainExercise.sets; indexSets++){

            fullTrain.push({
                exercise : exercise,
                sets : indexSets,
                reps : trainExercise.reps,
                //restTime : 30,
                repsMode : trainExercise.repsMode
            });

            fullTrain.push({
                exercise : rest,
                sets : indexSets,
                reps : 30,
                //restTime : 30,
                repsMode : 'scd'
            });
            
        }
    }

    return fullTrain;

}
