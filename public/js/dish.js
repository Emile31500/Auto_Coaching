const addFoodToDishs = document.querySelectorAll('.addFoodToDish')
const foodCreatDishForm = document.querySelector('.foodDishForm');
const dishFilterFoodForm = document.querySelector('#dishFilterFoodForm')
const addedFood = document.querySelector('#addedFood');
const foodsDishInput = document.querySelector('#foodsDishInput')
const dishFoodsFilter = document.querySelector('#dishFoodsFilter')

foodCreatDishForm.addEventListener('submit', function (event) {

    event.preventDefault();

    
    const foodWeightElements = document.querySelectorAll('.foodWeight');
    var foodWeight = [];
    
    foodWeightElements.forEach(foodWeightElement => {
        foodWeight.push('{foodId: '+foodWeightElement.getAttribute("foodId")+', weight: '+foodWeightElement.value+'}')
    })

    foodsDishInput.setAttribute('value', "["+foodWeight.toString()+"]");

    data = new FormData(this)
    this.submit(data);
    
})

dishFilterFoodForm.addEventListener('submit', function (event) {

    event.preventDefault();

    const foodWeightElements = document.querySelectorAll('.foodWeight');
    var foodWeight = [];
    
    foodWeightElements.forEach(foodWeightElement => {
        foodWeight.push((foodWeightElement.getAttribute("foodId")+'spl1t3r'+foodWeightElement.value))
    })

    dishFoodsFilter.setAttribute('value', foodWeight.toString());

    data = new FormData(this)
    this.submit(data);
    
})

function initDelete() {

    const btnsDelete = document.querySelectorAll('.deleteFoodButton');
    btnsDelete.forEach(btnDelete => {
        btnDelete.removeEventListener('click', deleteFoodWrapper)
        btnDelete.addEventListener('click', deleteFoodWrapper)
    });

}

function deleteFoodWrapper(event){
    
    deleteFood.call(this, event)
}


function deleteFood (e){
    
    e.preventDefault();
    this.parentElement.parentElement.remove()

}

initDelete();


addFoodToDishs.forEach(addFoodToDish => {

    addFoodToDish.addEventListener("click", function (event) {

        event.preventDefault();

        const id = addFoodToDish.getAttribute('idFood')
        const body = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }
        
        fetch('/api/food/'+id, body)
        .then(response => response.json())
        .then(data => {
            if (data.data !== undefined) {
                const tr = document.createElement('tr')
                // tr.innerHTML = '<th scope="row">'+data.data.name+'</th>'

                const th = document.createElement('th')
                th.setAttribute('scope', 'row')
                th.innerHTML = data.data.name;
                
                const firstTd = document.createElement('td')
                const foodIdEl =  document.createElement('input')
                foodIdEl.setAttribute('type', 'number')
                foodIdEl.setAttribute('foodId', data.data.id)
                foodIdEl.setAttribute('class', "form-control foodWeight")
                foodIdEl.setAttribute('placeholder', "g / ml")
                firstTd.appendChild(foodIdEl)

                const scdTd = document.createElement('td')
                const btnDelete = document.createElement('button')
                btnDelete.setAttribute('class', "btn btn-outline-danger deleteFoodButton")
                const faIcon = document.createElement('i')
                faIcon.setAttribute('class', "fa-solid fa-trash")
                const supprimer = document.createElement('span')
                supprimer.innerHTML = 'Supprimer'
                btnDelete.appendChild(faIcon)
                btnDelete.appendChild(supprimer)

                scdTd.appendChild(btnDelete)

                tr.appendChild(th)
                tr.appendChild(firstTd)
                tr.appendChild(scdTd)
                
                addedFood.appendChild(tr)

                initDelete()

            }
        });


    });
    
});
