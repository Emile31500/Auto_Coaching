fetch('/api/measurment', {

    method: 'GET',
    headers: {
        'Content-Type' : 'application/json'
    }

})
.then(response => response.json())
.then(data => {

    if (data.code === 200) {

        const formatedData = transformData(data.data)

        new Chart(document.getElementById("chartjs-line"), {
            type: "line",
            data: {
                labels: formatedData.dates,
                datasets: [{
                    label: "Poids (kg)",
                    fill: true,
                    backgroundColor: "transparent",
                    borderColor: window.theme.primary,
                    data: formatedData.weights
                }]
                },
                options: {
                scales: {
                    xAxes: [{
                    reverse: true,
                    gridLines: {
                        color: "rgba(0,0,0,0.05)"
                    }
                    }],
                    yAxes: [{
                    borderDash: [5, 5],
                    gridLines: {
                        color: "rgba(0,0,0,0)",
                        fontColor: "#fff"
                    }
                    }]
                }
            }
        });

    }

    return data
});


function transformData(data) {
  const weights = [];
  const dates = [];
  const bmis = [];

  data.forEach(item => {
    // Weight
    weights.push(item.weight);

    // Date formatted as yy-mm-dd
    const date = new Date(item.createdAt);
    const formattedDate = date.toISOString().slice(2, 10); // yy-mm-dd
    dates.push(formattedDate);

    // BMI = weight (kg) / (height in meters)^2
    const heightInMeters = item.size / 100;
    const bmi = item.weight / (heightInMeters * heightInMeters);
    bmis.push(Number(bmi.toFixed(2))); // rounded to 2 decimals
  });

  return {
    weights : weights,
    dates : dates,
    bmis : bmis
  };
}
