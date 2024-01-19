let measurmentForm = document.querySelector('#measurmentForm');

    let weightZone = document.querySelector("#weightZone")
    let sizeZone = document.querySelector("#sizeZone")
    let suroundShoulersZone = document.querySelector("#suroundSouldersZone")
    let suroundWaistZone = document.querySelector("#suroundWaistZone")
    let suroundArmsZone = document.querySelector("#suroundArmsZone")
    let suroundChestZone = document.querySelector("#suroundChestZone")

    let weight = document.querySelector("#weight")
    let size = document.querySelector("#size")
    let suroundShoulers = document.querySelector("#suroundSoulders")
    let suroundWaist = document.querySelector("#suroundWaist")
    let suroundArms = document.querySelector("#suroundArms")
    let suroundChest = document.querySelector('#suroundChest')
    let ongletMeasurmentAlert = document.querySelector('#ongletMeasurmentAlert');
    let measurmentTableBody = document.querySelector('#measurmentTableBody');

    measurmentForm.addEventListener('submit', function(event){

        event.preventDefault();

        const rawData = JSON.stringify({
            weight: weight.value,
            size: size.value,
            suroundShoulers: suroundShoulers.value,
            suroundWaist: suroundWaist.value,
            suroundArms: suroundArms.value,
            suroundChest: suroundChest.value
        });

        fetch('/api/measurment', {
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
                fetchMeasurment();

            }

        })
        .catch(error => console.log('error', error));
    });