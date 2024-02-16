submitUserFormButton.addEventListener('click', async (event) => {

    event.preventDefault();

    if (confirmpassword.value === password.value) {

        const raw = JSON.stringify({
            email: email.value,
            name: username.value,
            password: password.value
        });

        const res = await fetch('/api/users', {
            method: "PATCH",
            headers: {"Content-type": "application/json"},
            body: raw

        }).then(response =>  {

            if (response.status === 204) {

                ongletCompteAlert.classList.remove('alert-danger');
                ongletCompteAlert.classList.remove('d-none');
                ongletCompteAlert.classList.add('alert-success');
                ongletCompteAlert.innerHTML = "Paramètres du compre mis à jour";

            } else {

                ongletCompteAlert.classList.add('alert-danger');
                ongletCompteAlert.classList.remove('d-none');
                ongletCompteAlert.classList.remove('alert-success');
                ongletCompteAlert.innerHTML = "Error : " + response.status + " <br> Unkown error, this user can't be updated";

            } 
        })

    } else {
        
        ongletCompteAlert.classList.add('alert-danger');
        ongletCompteAlert.classList.remove('d-none');
        ongletCompteAlert.classList.remove('alert-success');
        ongletCompteAlert.innerHTML = "Attention : vos mots de passes ne sont pas identitique";
    }

});