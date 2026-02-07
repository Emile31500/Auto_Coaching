let orderParameter = 'name';
let orderBy = 'ASC';
let orderByButtons = document.querySelectorAll('.orderByButton');

alimentNameSearch.addEventListener('input', async function(event){
   
    event.preventDefault();
    getAllFood();

})

orderByButtons.forEach(orderByButton => {

    orderByButton.addEventListener('click', async function(event){

        event.preventDefault();

        if (orderByButton.dataset.parameter === orderParameter) {


            if (orderBy === 'ASC') {

                orderBy = 'DESC'

            } else {

                orderBy = 'ASC'

            }

        } else {

            orderParameter = orderByButton.getAttribute('data-parameter')

        }

        getAllFood();

    });    

});


async function getAllFood(){

    
    let url = document.querySelector('#baseResearchUrl').innerHTML;
    document.querySelector('#baseResearchUrl').remove();
    
    if (isAdmin) url.replace('api/food','api/admin/food');
    
    // let wordList = ''

    /*if (alimentNameSearch.value.length > 0){

        wordList = alimentNameSearch.value.replace(" ", ",");
        url = url + '/' + wordList + '/all'

    }*/

    url = url + '?orderParameter=' + orderParameter+'&orderBy=' + orderBy +'';

    console.log(url);

    await fetch(url, {
        method : 'GET',
        headers : {
            'Content-Type' : 'application/json'
        }
    }).then(response => response.json())
    .then(data => {

        if (data.code === 200) {
            
            printFoods(data.data)

        } else {

            foodTableBody.innerHTML = '<div class=\'alert alert-danger\'> Error : ' + data.code + '<br> ' + data.message + '</div>'

        }

    }) 

    postAteFood();

}
