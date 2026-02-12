form.addEventListener('submit', function(event) {

    event.preventDefault();
    card_paiement_loading.classList.remove('d-none');
    
    stripe.createToken(card).then(function(result) {

        if (result.error) {

            errorElement.textContent = result.error.message;

        } else {

            const url = '/api/checkout/';
            const jsonToken = result.token

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    idProduct:  idProduct.value,
                    token: jsonToken
                })
            }).then(response => { return response.json(); })
            .then(data => {

                card_paiement_loading.classList.add('d-none');
                errorElement.classList.remove('d-none');
                errorElement.innerHTML = data.message;

                if (data.code === 201) {

                    errorElement.classList.add('alert-success');

                } else {

                    errorElement.classList.add('alert-danger');

                }
            })

        }
    });
});