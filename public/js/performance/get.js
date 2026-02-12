async function fetchData() {
    
    const promise = await fetch('/api/performance', {
        methode: 'GET',
        headers: {'Content-type': 'application/json'}
    }).catch(error => console.log('error', error));

    let res = await promise.json();
    
    if (res.code == 200) {

        const lastPerf = res.data[0]

        perfZoneS.innerHTML = lastPerf.rmBench;
        perfZoneB.innerHTML = lastPerf.rmSquat;
        perfZoneD.innerHTML = lastPerf.rmDeadlift;
        
        let rowPerf = '';

        res.data.forEach(performance => {

            rowPerf += '<tr><td>' + performance.rmDeadlift + ' kg </td><td>' + performance.rmBench + ' kg </td><td>' + performance.rmSquat + ' kg </td><td>' + performance.createdAt.slice(0, 10) + '</td></tr>';
          
        })

        performanceTableBody.innerHTML = rowPerf;

    } else {

        alert("404");

    }
}

fetchData();