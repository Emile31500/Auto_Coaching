let cancelSubscriptions = document.querySelectorAll('.cancel-subscriptions')

cancelSubscriptions.forEach(cancelSubscription => {

    cancelSubscription.addEventListener('click', function(event){

        event.preventDefault();

        const url = this.getAttribute('url');
        
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => { 
          
            ongletCompteAlert.classList.remove('d-none');

            if (response.status) {

                ongletCompteAlert.classList.add('alert-success');
                ongletCompteAlert.innerHTML = 'Votre abbonnement a bien été annulé.';

            } else {

                ongletCompteAlert.classList.add('alert-danger');
                ongletCompteAlert.innerHTML = 'Erreur :'+response.status+'<br> Votre abbonement n\' pas put être supprimé pour une raison inconnu';

            }
            return response.json();
        
        })
    })
});