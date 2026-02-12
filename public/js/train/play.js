let indexEx = 0;
let previousIndexEx = 0;
let isPlayed = false;
let temps = 5
let i = 0;
let isPaused = false;
let isStoped = false;
let isTrainDone = false;
let timerActivated = false;
let startTimeout = 0;
let interval, timeout;
let fullTrain = [];

play.addEventListener('click', async function(event){

    isPaused = false;
    if (!isTrainDone){

        if (!isPlayed) {

            indexEx = 0;
            fullTrain = await parseTrain();
            isPlayed = true;
    
        }

        printExercises()
    }
});

next.addEventListener('click', async function(event){

    event.preventDefault();


    if (!timerActivated && !isTrainDone) {

        nextSets();

    }  else if (timerActivated) {

        isStoped = true;
        timerActivated = false;
        isPaused = false;
        previousIndexEx = indexEx;
        nextSets();
   
    }
});

previous.addEventListener('click', async function(event){

    isPaused = false;
    event.preventDefault();
    previousSets();

})

pause.addEventListener('click', function (event){

    event.preventDefault();
    isPaused = true;
    startTimeout = parseInt(secondTimer.innerHTML);
    pause.classList.add('d-none');
    play.classList.remove('d-none');

})

function diminuerTemps() {

    temps--;
    if (temps <= 0) {
        clearInterval(interval)
    }

}

function delayedLoop(i, temps, callback) {

    if (i <= temps) {

        if (!isPaused){

            if (!isStoped){

                timerActivated = true;            
                setTimeout(() => {

                        i++
                        delayedLoop(i, temps, callback);
                
                }, 1000);

                secondTimer.innerHTML = i    
                play.classList.add('d-none')
                pause.classList.remove('d-none')

            } else {

                i = 0;
                isStoped = false;
                secondTimer.innerHTML = '';
                return false;
            }

        } else {

            return false;
        }

    } else {

        startTimeout = 0;
        
        if (callback !== undefined) {

            timerActivated = false
            callback();

        }
    }
}

function nextSets() {

    indexEx++;
    startTimeout = 0;
    printExercises();

}

function previousSets () {

    indexEx = indexEx-1;
    isStoped = true;
    startTimeout = 0;
    printExercises();

}


function printExercises() {

    play.classList.add('d-none')
    pause.classList.remove('d-none')
    secondTimer.innerHTML = '';

    if (fullTrain[indexEx] !== undefined){

        currentExercise.innerHTML = fullTrain[indexEx].exercise.name + ' n° ' + (fullTrain[indexEx].sets +1);

        if (fullTrain[indexEx].exercise.name !== 'Rest') {

            printPreviousExercise();
            printNextExercise();

        }
        
        if (fullTrain[indexEx].repsMode === 'scd') {

            isStoped = false;
            temps = fullTrain[indexEx].reps
            delayedLoop(startTimeout, temps, nextSets)

        }

    } else {

        isTrainDone = true;
        currentExercise.innerHTML = 'Done !'

    }

}

function printNextExercise(){

    if (fullTrain[indexEx+2] !== undefined){

        nextExercise.innerHTML = fullTrain[indexEx+2].exercise.name + ' n° ' + (fullTrain[indexEx+2].sets+1);
    
    } else {

        nextExercise.innerHTML = 'Done !';

    }
}

function printPreviousExercise(){

    if (indexEx <= 1) {

         previousExercise.innerHTML = '';

    } else {

        nextExercise.innerHTML = fullTrain[indexEx-1].exercise.name + ' n° ' + (fullTrain[indexEx-1].sets + 1);
        
    }
}
