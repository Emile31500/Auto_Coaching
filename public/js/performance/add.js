

let performanceForm = document.querySelector('#performanceForm');
let squat = document.querySelector('#squat');
let benchPress = document.querySelector('#benchPress');
let deadLift = document.querySelector('#deadLift');
let date = document.querySelector('#date');
let ongletPerformanceAlert = document.querySelector('#ongletPerformanceAlert');

performanceForm.addEventListener('submit', async function(event){

    event.preventDefault();

    const rawData = JSON.stringify({
        rmSquat: squat.value,
        rmBench: benchPress.value,
        rmDeadlift: deadLift.value,
        createdAt: date.value,
        updatedAt: date.value
    })

    fetch('/api/performance', {
        method: 'POST',
        headers: {"Content-type": "application/json"},
        body: rawData
    }).then(response => response.json())
    .then(data => {
        
        
        if(data.code != 201){

            ongletPerformanceAlert.classList.remove('alert-danger');
            ongletPerformanceAlert.classList.remove('d-none');
            ongletPerformanceAlert.classList.add('alert-success');
            ongletPerformanceAlert.innerHTML = "Error : " + data.code + " <br> " + data.message;
                fetchData()

        } else {

            ongletPerformanceAlert.classList.remove('alert-danger');
            ongletPerformanceAlert.classList.remove('d-none');
            ongletPerformanceAlert.classList.add('alert-success');
            ongletPerformanceAlert.innerHTML = data.message;

        }

    })
    .catch(error => console.log('error', error));

});