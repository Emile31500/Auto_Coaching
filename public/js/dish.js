const addFoodToDishs = document.querySelectorAll('.addFoodToDish')
const foodCreatDishForm = document.querySelector('.foodDishForm');
const dishFilterFoodForm = document.querySelector('#dishFilterFoodForm')
const addedFood = document.querySelector('#addedFood');
const foodsDishInput = document.querySelector('#foodsDishInput')
const dishFoodsFilter = document.querySelector('#dishFoodsFilter')

console.log(foodCreatDishForm)
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

    const deleteFoodButtons = document.querySelectorAll('.deleteFoodButton');
    deleteFoodButtons.forEach(deleteFoodButton => {
        
        deleteFoodButton.addEventListener('click', function (event) {

            event.preventDefault();
            this.parentElement.parentElement.remove();
            
        });

    });

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
                tr.innerHTML = '<th scope="row">'+data.data.name+'</th><td><input type="number" foodId='+data.data.id+' class="form-control foodWeight" placeholder="g / ml"/></td><td><button class="btn btn-outline-danger deleteFoodButton"><i class="fa-regular fa-trash-can"></i> Supprimer</button></td>';
                
                addedFood.appendChild(tr)

            }
        });

        initDelete()

    });
    
});
