
function loadAllExercise() {
        
    fetch('/api/admin/exercise', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(response => response.json()
    ).then(data => {

        let htmlTableauExercise = ''

        if (data.code === 200) {

            data.data.forEach(exercise => {

                htmlTableauExercise += '<tr><td><div class=\'row\'><div class=\'col\'>' + exercise.name + ' </div><div style=\'max-width: 200px\' class=\'d-flex justify-content-end col\'><a class=\'delExerciseBtns\' data-bs-toggle=\'modal\' data-bs-target=\'#confirmDel\' data-id-exercise=\''+exercise.id+'\'>Supprimer</a></div></div></td></tr>'
                delExerciseBtns = document.querySelectorAll('.delExerciseBtns');
                delExerciseBtns.forEach(delExerciseBtn => {
  
                delExerciseBtn.addEventListener('click', function(event){

                        event.preventDefault();
                        idExerciseToDelete = delExerciseBtn.getAttribute('data-id-exercise')
                    })
                })

            });

            bodyExerciseList.innerHTML = htmlTableauExercise;
        } 
    });
}
loadAllExercise();