
    const id = document.querySelector('#trainId').innerHTML
    document.querySelector('#trainId').remove()
    const plus = document.querySelector('#plus')
    const pause = document.querySelector('#pause')
    const play = document.querySelector('#play')
    const stop = document.querySelector('#stop')
    const preventExerciseNameElement = document.querySelector('#preventExerciseNameElement')
    const preventExerciseImageElement = document.querySelector('#preventExerciseImageElement')
    const nextExerciseNameElement = document.querySelector('#nextExerciseNameElement')
    const nextExerciseImageElement = document.querySelector('#nextExerciseImageElement')
    const currentExerciseNameElement = document.querySelector('#currentExerciseNameElement')
    const currentExerciseRepsElement = document.querySelector('#currentExerciseRepsElement')
    const currentExerciseRepsModeElement = document.querySelector('#currentExerciseRepsModeElement')
    const currentExerciseImageElement = document.querySelector('#currentExerciseImageElement')
    const ding = new Audio('/media/audio/Bell Ding Sound EFFECT.mp3');

    let exerciseName = '';
    let exerciseImageUrl = '';
    let exerciseRepsMode = '';
    let exerciseReps = '';
    let exerciseSets = '';



    const moins = document.querySelector('#moins')
    let notInPause = true;

    pause.addEventListener('click', function name(params) {

        if (!notInPause) {
            pause.innerHTML='<i class="fa-solid fa-pause"></i>' 
        } else {
            pause.innerHTML='<i class="fa-solid fa-play"></i>' 
        }
        notInPause = !notInPause
    })

    let currentExerciseIndex = 0;
    let timeLeft = 0;
    let timerInterval = null;
    let notInPuse = true;

    

    fetch('/api/train/'+id, {
        method : 'GET',
        headers : {
            'Content-Type' : 'application/json'
        }
    }).then(response => response.json())
    .then(data => {

        const exerciseTrains = data.data.ExerciseTrains

        function startExercise() 
        {
           
            ding.play()
            const currentExercise = exerciseTrains[currentExerciseIndex];
            printPreventExercise(currentExerciseIndex)
            printExercise(currentExerciseIndex)
            printNextExercise(currentExerciseIndex)

            if (currentExerciseIndex < exerciseTrains.length) {

                 if (currentExercise.repsMode === 'scd') {

                    timeLeft = currentExercise.reps;
                    timerInterval = setInterval(() => {

                        if (notInPause) {
                            
                            timeLeft--;
                            printTimer()

                            if (timeLeft <= 0) {
                                clearInterval(timerInterval);
                                currentExerciseIndex++;
                                startExercise(exerciseTrains);
                            }
                        }

                    }, 1000);

                } else {

                    plus.removeEventListener('click', nextWrapper)
                    plus.addEventListener('click', nextWrapper)
                
                }
            }

           
        }

        function next (e){
        
            currentExerciseIndex++;
            clearInterval(timerInterval)
            startExercise()
        }

        function nextWrapper(event){
            
            next.call(this, event)
        }

        function printPreventExercise(currentExerciseIndex) {

            if (currentExerciseIndex > 0) {

                exerciseName = exerciseTrains[currentExerciseIndex-1].Exercise.name;
                exerciseImageUrl  = '/media/photo/'+exerciseTrains[currentExerciseIndex-1].Exercise.imageUrlPng;

            } else {

                exerciseName = ''
                exerciseImageUrl  = '';
            }

            preventExerciseNameElement.innerHTML = exerciseName ;
            preventExerciseImageElement.setAttribute('src', exerciseImageUrl);
        }

        function printExercise(currentExerciseIndex) {

            if (currentExerciseIndex < exerciseTrains.length) {

                exerciseName = exerciseTrains[currentExerciseIndex].Exercise.name;
                exerciseImageUrl = '/media/photo/'+exerciseTrains[currentExerciseIndex].Exercise.imageUrlGif;
                exerciseReps = exerciseTrains[currentExerciseIndex].reps;
                exerciseSets = exerciseTrains[currentExerciseIndex].sets;
                if ( exerciseTrains[currentExerciseIndex].repsMode === 'scd') {
                    exerciseRepsMode = 'secondes'
                } else {
                    exerciseRepsMode = 'répitions'
                }
               
            } else {

                exerciseName =  'Job finish !'

            }

            currentExerciseNameElement.innerHTML = exerciseName
            currentExerciseRepsModeElement.innerHTML = exerciseRepsMode
            currentExerciseRepsElement.innerHTML = exerciseReps
            currentExerciseImageElement.setAttribute('src', exerciseImageUrl);
           
        }
    
        function printNextExercise(currentExerciseIndex) {

            if (currentExerciseIndex < exerciseTrains.length-1) {

                exerciseName = exerciseTrains[currentExerciseIndex+1].Exercise.name;
                exerciseImageUrl  = '/media/photo/'+exerciseTrains[currentExerciseIndex+1].Exercise.imageUrlPng;

            } else if  (currentExerciseIndex === exerciseTrains.length-1) {

                exerciseName = 'Job finis !'
                exerciseImageUrl  = '';

            } else {

                exerciseName = ''
                exerciseImageUrl  = '';

            }

            nextExerciseNameElement.innerHTML = exerciseName ;
            nextExerciseImageElement.setAttribute('src', exerciseImageUrl);
        }


        function startWorkout() {
            currentExerciseIndex = 0;
            startExercise();
            pause.classList.remove('d-none')
            pause.classList.remove('d-none')
            play.removeEventListener('click', startWorkoutWrapper)
        }

        function startWorkoutWrapper() {

            startWorkout.call(this, event)
            this.classList.add('d-none')

            
        }

        play.addEventListener('click', startWorkoutWrapper)

    })

    function printTimer () {
        currentExerciseRepsElement.innerHTML = timeLeft;
    }