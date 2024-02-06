
async function parseTrain() {

    const trainId = document.querySelector('#trainId').innerHTML;
    const day = document.querySelector('#dayValue').innerHTML;
    const trainExercises = await getExerciseOfThisDay(trainId, day);
    let i = 0;
    let fullTrain = [];
    
    for (let index = 0; index < trainExercises.length; index++) {
        const trainExercise = trainExercises[index];

        let exercise = await getOneExercise(trainExercise.exerciseId);

        fullTrain.push({
            
            exercise : exercise,
            sets : trainExercise.sets,
            reps : trainExercise.reps,
            restTime : 30,
            repsMode : trainExercise.repsMode

        });


        i++;
        
    }

    return fullTrain;

}
