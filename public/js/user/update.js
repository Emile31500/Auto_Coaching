    let userForm = document.getElementById("userForm");
let email = document.getElementById("email");
let name = document.getElementById("name");
let confirmpassword = document.getElementById("confirmpassword");
let password = document.getElementById("password");
let ongletCompteAlert = document.getElementById("ongletCompteAlert");

userForm.addEventListener('submit', function(event){

    event.preventDefault();

    const raw = JSON.stringify({
        email: email.value,
        name: name.value,
        password: password.value,
    });

    fetch('/api/users', {
        method: 'PATCH',
        headers: {"Content-Type": "application/json"},
        body: raw,
    }).then(response => response.json())
    .then(data => {
        
        
        if(data.code != 201){

            ongletCompteAlert.classList.remove('alert-danger');
            ongletCompteAlert.classList.remove('d-none');
            ongletCompteAlert.classList.add('alert-success');
            ongletCompteAlert.innerHTML = "Error : " + data.code + " <br> " + data.message;

        } else {

            ongletCompteAlert.classList.remove('alert-danger');
            ongletCompteAlert.classList.remove('d-none');
            ongletCompteAlert.classList.add('alert-success');
            ongletCompteAlert.innerHTML = "Paramètres du compre mis à jour";

        }

    })
    .catch(error => console.log('error', error));

});