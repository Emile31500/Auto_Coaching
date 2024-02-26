addExerciseForm.addEventListener('submit', function(event){

    event.preventDefault();

    const rawData = JSON.stringify({name: name.value});

    fetch('/api/admin/exercise', {
        method : 'POST',
        headers : {'Content-Type' : 'application/json'},
        body : rawData
    }).then(response => response.json()
    ).then(data => {

        if (data.code === 201){

            loadAllExercise();

        }
    });
});
