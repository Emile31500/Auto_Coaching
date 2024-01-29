
let responseFoodAteRequest = document.querySelector('#responseFoodAteRequest');
let date = document.querySelector('#date').innerHTML;

let tempDate = new Date(date);
let day = ("0" + (tempDate.getDate()+1)).slice(-2);
let month = ("0" + (tempDate.getMonth()+1)).slice(-2);
let year = tempDate.getFullYear();
let listAteFoodHTML = document.querySelector('#listAteFoodHTML');


const dateEnd = year + "-" + month + "-" + 19 + ' 00:00:00';

console.log(date + " à " + dateEnd)

const url = '/api/food/eat/' + date + '/' + dateEnd
fetch(url, {

    method: 'GET',
    headers: {
    'Content-Type': 'application/json'
  }

}).then(response => {

    return response.json();

}).then(data => {

    if(data.code == 200){

        responseFoodAteRequest.classList.add('d-none');

        data.data.forEach(ateFood => {
            
            fetch('/api/food/' + ateFood.foodId , {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                }
            }).then(response => response.json())
            .then(data => {

                food = data.data;
                listAteFoodHTML.innerHTML += "<tr><td>" + food.name + "</td><td>"+ateFood.weight+"</td><td><button data-id-food='" + ateFood.foodId + "' class='delete-ate-food-btn btn btn-danger' > x </button></td></tr>";
                
            })

        });

    } else {

        responseFoodAteRequest.classList.remove('d-none');
        responseFoodAteRequest.classList.add('alert-warning');
        responseFoodAteRequest.innerHTML = "Warning : No data yet for this day";

    }


});
