confirmDeletionBtn.addEventListener('click', func = function(event){

    fetch('/api/admin/exercise/'+idExerciseToDelete, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}

    }).then(response => {
            
        if (response.status === 204) {

            loadAllExercise();

        } else {

            return response.json();

        }

    }).then(data => {

        exerciseAlert.classList.remove('d-none');
        exerciseAlert.classList.add('alert-danger');
        exerciseAlert.innerHTML = 'Error ' + data.code + ': <br>' + data.message

        colse-del-modal.click();
        confirmDeletionBtn.removeEventListener("click", func);

    });
});

