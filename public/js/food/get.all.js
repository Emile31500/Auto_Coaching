console.log('linked')

alimentName.addEventListener('input', async function(event){
    event.preventDefault();

    const wordList = alimentName.value.replace(" ", ",");
    const url = '/api/food/' + wordList + '/all'

    await fetch(url, {
        method : 'GET',
        headers : {
            'Content-Type' : 'application/json'
        }
    }).then(response => response.json())
    .then(data => {

        if (data.code === 200) {

            printFoods(data.data)

        }

    }) 


})