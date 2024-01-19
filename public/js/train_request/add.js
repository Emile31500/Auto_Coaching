trainRequestForm.addEventListener('submit', function (event){

    event.preventDefault();

    
    if (passedSports.length > 0){

        for (let i = 0; i < passedSports.length; i++) {
            
            passedSports[i] = JSON.parse(passedSports[i])
            if (passedSports[i].name === undefined) {

                passedSports.splice(i, 1);

            }
        }
    }

    console.log(passedSports)

    if (passedInjs.length > 0){

        for (let i = 0; i < passedInjs.length; i++) {
            
            passedInjs[i] = JSON.parse(passedInjs[i])
            if (passedInjs[i].name === undefined) {

                passedInjs.splice(i, 1);

            }
        }
    }


    const rawData = JSON.stringify({
        trainRequest : {
            weight: weight.value,
            height: height.value,
            birthDay: birthDay.value,
            objectif: objectif.value,
            metabolism: metabolism.value,
            description: description.value
        },
        passedSport: passedSports,
        passedInj: passedInjs,

    });
    
    fetch('/api/train/request', {
        method: 'POST',
        headers: {"Content-Type" : "application/json"},
        body: rawData
    }).then(response => response.json())
    .then(data => {
        
        trainRequestAlert.classList.remove('d-none');
        
        if(data.code == 201){

            trainRequestAlert.classList.remove('alert-danger');
            trainRequestAlert.classList.add('alert-success');
            trainRequestAlert.innerHTML = data.message;


        } else {

            trainRequestAlert.classList.remove('alert-success');
            trainRequestAlert.classList.add('alert-danger');
            trainRequestAlert.innerHTML = "Error : " + data.code + " <br> " + data.message;
        }

    })
    .catch(error => {

        trainRequestAlert.classList.remove('d-none');
        trainRequestAlert.classList.remove('alert-success');
        trainRequestAlert.classList.add('alert-danger');
        trainRequestAlert.innerHTML = "Error : " + data.code + " <br> " + data.message;

    });
});