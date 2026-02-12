function postAteFood() {

    let alimentForms = document.querySelectorAll('.alimentForms');

    alimentForms.forEach(form => {

        form.addEventListener("submit", async function(e){

            e.preventDefault();
            data = new FormData(this);

            if (!ateFoodDate.value) {

            ateFoodDate.value = getTodayDate();

            }

            var raw = JSON.stringify({
                foodId: parseInt(data.get("foodId")),
                weight: parseInt(data.get("weight")),
                userId: null,
                createdAt: ateFoodDate.value,
                updatedAt: ateFoodDate.value
                })
                
            fetch('/api/food/ate', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: raw

            }).then(response => {

                calculateAteFood(ateFoodDate.value);
                nutrition_alert.innerHTML = "Votre aliment a bien été enregistré";
                nutrition_alert.classList.add('alert-success');
                nutrition_alert.classList.remove('alert-danger');
                nutrition_alert.classList.remove('d-none');

                if(response.status == 201){

                    let interv = setInterval(function (){

                        nutrition_alert.classList.add('d-none');
                        clearInterval(interv);

                    }, 2000);
                    form.reset();

                } else {

                    nutrition_alert.innerHTML = "Erreur : "

                    nutrition_alert.classList.remove('d-none');
                    nutrition_alert.classList.remove('alert-success');
                    nutrition_alert.classList.add('alert-danger');

                }

                return response.json();

            }).then(data => {
            
            if(data['message'] != undefined) {

                nutrition_alert.innerHTML =  data['message'];


            }

            }).catch(error => {

            nutrition_alert.innerHTML = "Erreur : "
            nutrition_alert.classList.remove('d-none');
            nutrition_alert.classList.remove('alert-success');
            nutrition_alert.classList.add('alert-danger');

            });

        });
    });
}

postAteFood()
