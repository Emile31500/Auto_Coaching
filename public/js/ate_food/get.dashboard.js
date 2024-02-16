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


    let url = "/api/food/ate/" + daySearched +"/" + endDate;

    const res = await fetch(url, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
    }).then(response => {

        return response.json();

    }).then(data => {

       
        if (data.code === 200){
            return data.data
        }

    }).catch(error => {

        console.log(error);

    });

    return res;

}

async function calculateAteFood(currentDate){

    if (!currentDate){

        currentDate = getTodayDate();

    }

    detailsAteFoods.setAttribute('href', '/food/ate/' +currentDate);
    const ateAliments = await getEatingAliment(currentDate);

    if (ateAliments) {

        let ttlProt = 0, ttlCarbo = 0, ttlFat = 0, ttlTransFat = 0, ttlEnergie = 0;
        let macro;

        nutrientRequirement = await getNutritionRequirement();

        ateAliments.forEach(async (eatenAliment) => {

            let food = await getThisFood(eatenAliment.foodId)

            if (food) {

                ttlProt += food.proteine * (eatenAliment.weight / 100)
                ttlFat += food.fat * (eatenAliment.weight / 100)
                ttlTransFat += food.trans_fat * (eatenAliment.weight / 100)
                ttlCarbo += food.carbohydrate * (eatenAliment.weight / 100)
                ttlEnergie = ttlFat*9.08222 + ttlCarbo*4.063 + ttlProt*4.063;

            } else {
                console.log('No data or an error occurred.');
            }

            macro = JSON.stringify({
                energie: ttlEnergie,
                proteine: ttlProt,
                carbohydrate: ttlCarbo,
                fat: ttlFat
            });
    
            printMacroOnDashbord(macro);
            printMacroInPrcnt(macro, nutrientRequirement);
        });

    } else {

        console.log(' 1 No data or an error occurred : ');

    }

}

calculateAteFood(currentDate);

async function getThisFood(id) {

    const response = await fetch('/api/food/' + id, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
    }).then(response => {

        return response.json();

    }).then(data => {

        if (data.code === 200) {

            return data.data;

        }

    });

    return response;
}

async function getNutritionRequirement(){

    const nutrientRequirement = await fetch('/api/nutrition/requirement', {
        method : 'GET',
        headers : {
            'Content-Type' : 'application/json'
        }
    }).then(response => {

        return response.json()

    }).then(data => {

        if (data.code === 200) {

            return data.data;

        }
    });

    return nutrientRequirement;
}

function printMacroOnDashbord(ttlMacro) {

    ttlMacro = JSON.parse(ttlMacro)

    protAteAbs.innerHTML = Math.round((ttlMacro.proteine) * 10) / 10;
    kcalAteAbs.innerHTML = Math.round((ttlMacro.energie) * 10) / 10;;
    fatAteAbs.innerHTML = Math.round((ttlMacro.fat) * 10) / 10;;

    return true;

}

async function printMacroInPrcnt(ttlMacro, requirement) {

    console.log(requirement)

    ttlMacro = JSON.parse(ttlMacro)


    var prcntProt =  ttlMacro.proteine / requirement.proteine * 100
    var prcntFat =  ttlMacro.fat / requirement.fat * 100
    var prcntEner =  ttlMacro.energie / requirement.kcalorie * 100

    protAtePrct.innerHTML = Math.round((prcntProt) * 10) / 10;
    kcalAtePrct.innerHTML = Math.round((prcntEner) * 10) / 10;;
    fatAtePrct.innerHTML = Math.round((prcntFat) * 10) / 10;;

    return true;

}
