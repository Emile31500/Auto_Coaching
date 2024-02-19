alimentName.addEventListener('input', async function(event){
    event.preventDefault();

    let url = '/api/food';
    let wordList = ''

    if (alimentName.value.length > 0){

        wordList = alimentName.value.replace(" ", ",");
        url = url + '/' + wordList + '/all'

    }

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

})