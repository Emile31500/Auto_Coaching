async function fetchOneMesurments() {

    let row = '';

    const promise = await fetch('/api/measurment', {
    methode: 'GET',
    headers: {'Content-type': 'application/json'}
    }).catch(error => console.log('error', error));

    let res = await promise.json();

    if (res.code == 200){

        const lastMeasurment = res.data[0]

        weightZone.innerHTML = lastMeasurment.weight; 
        sizeZone.innerHTML = lastMeasurment.size; 
        suroundShoulersZone.innerHTML = lastMeasurment.suroundShoulers; 
        suroundWaistZone.innerHTML = lastMeasurment.suroundWaist; 
        suroundArmsZone.innerHTML = lastMeasurment.suroundArms; 
        suroundChestZone.innerHTML = lastMeasurment.suroundChest;

        res.data.forEach(measurment => {

            row += '<tr><td> ' + measurment.weight + ' kg </td><td>' + measurment.size + ' cm </td>';
            row += '<td>' + measurment.suroundShoulers + '</td><td> ' + measurment.suroundChest + '</td>';
            row += '<td>' + measurment.suroundArms + '</td><td> ' + measurment.suroundWaist + '</td></tr>';

        });

        measurmentTableBody.innerHTML = row;

    }

}
fetchOneMesurments();