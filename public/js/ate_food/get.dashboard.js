
let protAteAbs = document.querySelector("#protAteAbs");
let kcalAteAbs = document.querySelector("#kcalAteAbs");
let fatAteAbs = document.querySelector("#fatAteAbs");
let ateAlimentsForm = document.querySelector("#ateAlimentsForm");
let dateAteAliments = document.querySelector("#dateAteAliments"); 
let ttlMacro, ttlMacroPromise;

function getTodayDate(date = undefined) {

let date_ob;

if (date){

    date_ob = new Date(date);
    
} else {

    date_ob = new Date();

}

let day = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth()+1)).slice(-2);
let year = date_ob.getFullYear();

return (year + "-" + month + "-" + day + ' 00:00:00');

}

const currentDate = getTodayDate();

ateAlimentsForm.addEventListener('submit', function (event) {

event.preventDefault()

let currentDate = getTodayDate(dateAteAliments.value)

calculateAteFood(currentDate);


});

async function getEatingAliment(daySearched){

let currentDate = getTodayDate(daySearched);

let endDate = new Date(currentDate).getFullYear() + "-" + (new Date (currentDate).getMonth()+1) + "-" + (new Date (currentDate).getDate()+1) + ' 00:00:00'; 

let url = "/api/food/eat/" + daySearched +"/" + endDate;

const promise = await fetch(url, {
    method: 'GET',
    headers: {
    'Content-Type': 'application/json'
    }
}).catch(error => {

    console.log('error');

});

let data = await promise.json();
if (data.code == 200) {
    
    return data.data;

}

}

function calculateAteFood(currentDate){

if (!currentDate){

    currentDate = getTodayDate();

}

document.querySelector('#detailsAteFoods').setAttribute('href', '/food/ate?date='+currentDate);

let ttlProt = 0, ttlCarbo = 0, ttlFat = 0, ttlTransFat = 0, ttlEnergie = 0;
getEatingAliment(currentDate).then(eatenAliments => { 

    if (eatenAliments) {

    ttlMacroPromise = eatenAliments.forEach(eatenAliment => {

        let promise = getThisFood(eatenAliment.foodId).then(food => { 
        if (food) {

            ttlProt += food.proteine * (eatenAliment.weight / 100)
            ttlFat += food.fat * (eatenAliment.weight / 100)
            ttlTransFat += food.trans_fat * (eatenAliment.weight / 100)
            ttlCarbo += food.carbohydrate * (eatenAliment.weight / 100)
            ttlEnergie = ttlFat*9 + ttlCarbo*4 + ttlProt*4;

            let data = JSON.stringify({ 
                    energie: ttlEnergie,
                    proteine: ttlProt,
                    carbohydrate: ttlCarbo,
                    fat: ttlFat
                });

            printMacroOnDashbord(data);
        
        } else {
            console.log('No data or an error occurred.');
        }

        }).catch(error => {
            console.error('An unexpected error occurred:', error);
        });

        let res = promise;
        return res;

    });

    } else {

    console.log('No data or an error occurred.');

    }

}).catch(error => {console.error('An unexpected error occurred:', error);});

}

calculateAteFood(currentDate);

async function getThisFood(id) {
    try {
    const response = await fetch('/api/food/' + id, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not OK');
    }

    const data = await response.json();

    if (data.code == 200) {

        return data.data;

    }
    

    } catch (error) {

    console.error('Error:', error);
    return null;

    }
}

function printMacroOnDashbord(ttlMacro) {

    ttlMacro = JSON.parse(ttlMacro)

    protAteAbs.innerHTML = Math.round((ttlMacro.proteine) * 10) / 10;
    kcalAteAbs.innerHTML = Math.round((ttlMacro.energie) * 10) / 10;;
    fatAteAbs.innerHTML = Math.round((ttlMacro.fat) * 10) / 10;;

    return true;

}