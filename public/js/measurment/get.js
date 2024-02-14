async function fetchMeasurments() {

    const res = await fetch('/api/measurment', {
        methode: 'GET',
        headers: {'Content-type': 'application/json'}
    })
    .then(response => { 
    
        return response.json();
    
    })
    .then(data => { 
    
        return data;
    
    })
    .catch(error => console.log('error', error));

    if (res.code === 200) {

        return res.data;

    }
}

async function printMeasurments() {

    let row = '';

    let res = await fetchMeasurments();

    if (res){

        const lastMeasurment = res[0]

        weightZone.innerHTML = lastMeasurment.weight; 
        sizeZone.innerHTML = lastMeasurment.size; 
        suroundShouldersZone.innerHTML = lastMeasurment.suroundShoulers; 
        suroundWaistZone.innerHTML = lastMeasurment.suroundWaist; 
        suroundArmsZone.innerHTML = lastMeasurment.suroundArms; 
        suroundChestZone.innerHTML = lastMeasurment.suroundChest;

        res.forEach(measurment => {

            row += '<tr><td> ' + measurment.weight + ' kg </td><td>' + measurment.size + ' cm </td>';
            row += '<td>' + measurment.suroundShoulers + '</td><td> ' + measurment.suroundChest + '</td>';
            row += '<td>' + measurment.suroundArms + '</td><td> ' + measurment.suroundWaist + '</td></tr>';

        });

        measurmentTableBody.innerHTML = row;

    }

}
printMeasurments();