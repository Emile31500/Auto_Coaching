async function getExerciseOfThisDay(idTrain, day){

    const url = '/api/train/'+idTrain+'/exercise/' + day;

    const res  = await fetch(url, {

        method : 'GET',
        headers : {
            'Content-type' : 'application/json'
        }

    }).then(response => {

        return response.json();

    }).then(data => {

        if (data.code === 200) {

            return data.data;
            
        }

    });


    return res;

}