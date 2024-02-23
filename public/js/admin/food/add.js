foodForm.addEventListener('submit', function(event){

    event.preventDefault();
    let rawData;
    let verb;
    let url = '/api/admin/food'

    const dataElment = JSON.stringify({
        name: nameAliment.value,
        kcalorie: kcalorieEl.value,
        carbohydrate: carbohydrateEl.value,
        sugar: sugarEl.value,
        proteine: proteinEl.value,
        fat: fatEl.value,
        trans_fat: transFatEl.value,
        is_meat : isMeatEl.checked,
        is_milk : isEggEl.checked,
        is_egg : isMilkEl.checked, 
        is_veggie : !(isMilkEl.checked || isMeatEl.checked || isEggEl.checked )

    });

    if (isUpdated.checked){

        verb = 'PATCH';
        url += '/'+idAliment

    } else {

        verb = 'POST';
        rawData = dataElment

    }
    
    console.log(dataElment);

    fetch(url, {
        method: verb,
        headers: {'Content-Type': 'application/json'},
        body: dataElment

    }).then(response => response.json())
    .then(data => {

        getAllFood()
        if (data.code === 201){

            alimentAlert.classList.remove('d-none')
            alimentAlert.classList.add('alert-success')
            alimentAlert.innerHTML = 'L\'aliment a été créé avec succès';

        } else if (data.code === 202){

            alimentAlert.classList.remove('d-none')
            alimentAlert.classList.add('alert-success')
            alimentAlert.innerHTML = 'L\'aliment a été mis à jour avec succès';
        } else {

            alimentAlert.classList.remove('d-none')
            alimentAlert.classList.add('alert-danger')
            alimentAlert.innerHTML = 'Error : ' + data.code +'<br>'
            alimentAlert.innerHTML += data.message;
            
        }
    });
});