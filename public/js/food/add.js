alert('co')
    let isEggEl = document.querySelectorAll(".isEgg")
    let isMeatEl = document.querySelectorAll(".isMeat")
    let isMilkEl = document.querySelectorAll(".isMilk")
    let isMeat, isMilk, isEgg, isVeggie;

    addFoodForms.addEventListener('submit', function(event){

        event.preventDefault();

        isMeat = settingRadioValue(isMeatEl);
        isMilk = settingRadioValue(isMilkEl);
        isEgg = settingRadioValue(isEggEl);
        isVeggie = !(isEgg || isMeat || isMilk)

        fetch('/api/food', {
            method: 'POST',
            headers: {
                'Content-type': 'application/JSON'
            },
            body: JSON.stringify({
                name: name.value,
                carbohydrate: carbohydrate.value,
                proteine: proteine.value,
                fat: fat.value,
                trans_fat: trans_fat.value,
                isEgg: isEgg,
                isMilk: isMilk, 
                isMeat: isMeat, 
                isVeggie: !(isMeat || isEgg || isMilk)

            })

        }).then(response => {

            addingFoodMessageElement.innerHTML = "Votre aliment a bien été créé";
            addingFoodMessageElement.classList.add('alert-success');
            addingFoodMessageElement.classList.remove('alert-danger');
            addingFoodMessageElement.classList.remove('d-none');

            if(response.status == 201){

                let interv = setInterval(function (){

                    addingFoodMessageElement.classList.add('d-none');
                    clearInterval(interv);

                }, 2000);
            }
        });
    });

    function settingRadioValue(checkElement){

        for (let i = 0; i < checkElement.length; i++) {

            if (checkElement[i].checked){

                checkValue = checkElement[i].value
                
                if (checkValue == 'true') {

                    checkValue = true;
                
                } else {

                    checkValue = false;

                } 

                return checkValue

            }
        }
    }