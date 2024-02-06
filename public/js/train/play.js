const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const play = document.querySelector('#play');
let indexEx = 0;
let indexSets = 0;
let previousIndexEx = 0;
let isPlayed = false;
let fullTrain
let temps = 5
let interval;
let timeout;
let i = 0;

play.addEventListener('click', async function(event){

    if (!isPlayed) {

        fullTrain = await parseTrain();
        isPlayed = true
        indexEx = 0;
        indexSets = 0;

    }
   
    printThisExercise();
   
});

next.addEventListener('click', async function(event){

    event.preventDefault();
    // debugger;
    nextSets(printThisExercise);
        
});

previous.addEventListener('click', function(event){

    event.preventDefault();
    previousSets();

})

function diminuerTemps() {

    temps--;
    console.log(temps)
    if (temps <= 0) {
        clearInterval(interval)
    }

}

function delayedLoop(i=0, temps, callback) {

    // debugger;    
    if (i < temps) {
        
        setTimeout(() => {

            console.log(i)
            delayedLoop(i + 1, temps, callback);
        
        }, 1000);

    } else {

        if (callback !== undefined) {

            callback();

        }
    }
}



function nextSets(nextSetsCallback) {

    // debugger;
    temps = fullTrain[indexEx].restTime;
    temps = 5;

    delayedLoop(0, temps, () => {
        
        indexSets++;
        previousIndexEx = indexEx;

        if (fullTrain[indexEx].sets <= indexSets) {

            indexEx++;
            indexSets = 0;

        }

        nextSetsCallback();
    
    });    
}

function previousSets () {

    indexSets-=1;
    if (indexSets < 0) {
        
        if (indexEx > 0) {
            
            indexEx -= 1;
            indexSets = fullTrain[indexEx].sets-1;
        
        }
    }

    printThisExercise();
    
}

function printThisExercise(){

    console.log(fullTrain[indexEx].exercise.name);
    
    if (fullTrain[indexEx].repsMode === 'scd') {

        temps = fullTrain[indexEx].reps
        diminuerTemps();
        nextSets(printThisExercise);

    }

}
