let jsonData = {}


async function exec() { 
    let measurments = await fetchMeasurments();
    console.log(measurments)
}
exec()

measurmentForm.addEventListener('submit', async function (event){

    event.preventDefault();

    let measurments = await fetchMeasurments();
    let previousMeasurment = measurments[0];
    let haveToGainWeight = false, haveToLoseWeight = false

    let objectif = await getObjectif()
    objectif = objectif.toLowerCase();

    if (objectif === 'volume' || objectif === 'force'){

        haveToGainWeight = true;


    } else if (objectif.include('perdre du poids')) {

        haveToLoseWeight = true;
    }

    let nutritionRequirement = await fetch('/api/nutrition/requirement/', {
        method : 'GET',
        headers : {
            'Content-Type':'application/json'
        }

    }).then(response => {
        return response.json()
    }).then(data => {
        if (data.code === 200){
            return data.data;
        }
    }) 

    let newKcalorieRequirement = nutritionRequirement.kcalorie;
    let newProteinRequirement = nutritionRequirement.protein;

    if (haveToGainWeight) {
        
        if (previousMeasurment.weight >= weight.value) {

            newKcalorieRequirement = nutritionRequirement.kcalorie * 1.02;
        }

        newProteinRequirement = weight.value * 2;

    } else if (haveToLoseWeight) {

        if (previousMeasurment.weight <= weight.value) {

            newKcalorieRequirement = nutritionRequirement.kcalorie * 0.98;

        }

        newProteinRequirement = weight.value * 2.2;

    }

    jsonData = JSON.stringify({
        kcalorie : newKcalorieRequirement,
        fat : weight.value,
        protein : newProteinRequirement,
        updatedAt : getTodayDate()
    })

    await fetch('/api/nutrition/requirement/', {
        method : 'PATCH',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : jsonData
    }) 

    const rawData = JSON.stringify({
        weight: weight.value,
        size: size.value,
        suroundShoulers: suroundShoulders.value,
        suroundWaist: suroundWaist.value,
        suroundArms: suroundArms.value,
        suroundChest: suroundChest.value
    });

    await fetch('/api/measurment', {
        method: 'POST',
        headers: {"Content-Type" : "application/json"},
        body: rawData
    }).then(response => response.json())
    .then(data => {
        
        
        if(data.code != 201){

            ongletMeasurmentAlert.classList.remove('alert-danger');
            ongletMeasurmentAlert.classList.remove('d-none');
            ongletMeasurmentAlert.classList.add('alert-success');
            ongletMeasurmentAlert.innerHTML = "Error : " + data.code + " <br> " + data.message;
            

        } else {

            ongletMeasurmentAlert.classList.remove('alert-danger');
            ongletMeasurmentAlert.classList.remove('d-none');
            ongletMeasurmentAlert.classList.add('alert-success');
            ongletMeasurmentAlert.innerHTML = data.message;
            printMeasurments();

        }

    })
    .catch(error => console.log('error', error));
});

async function getObjectif(){


    const res = await fetch('/api/train/request', {
        method: 'GET',
        headers: {"Content-Type" : "application/json"},
    })
    .then(response => { return response.json()})
    .then(data => { return data})
    .catch( error => console.log(error)) 

    if (res.code === 200) {

        return res.data[0].objectif;

    }
}