let delAlimentBtns = document.querySelectorAll('.delAlimentBtns');

delAlimentBtns.forEach(delAlimentBtn => {

    delAlimentBtn.addEventListener('click', function(){

        let idAliment = this.getAttribute('data-id-aliment');
        confirmDeletionBtn.setAttribute('data-id-aliment', idAliment)

    });

})

confirmDeletionBtn.addEventListener('click', func = function(event){

    let idAliment = this.getAttribute('data-id-aliment');
    const url = '/api/admin/food/'+idAliment
    fetch(url, {

        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}

    }).then(response => {
            
        if (response.status === 204) {

            alimentAlert.classList.remove('d-none')
            alimentAlert.classList.add('alert-success')
            alimentAlert.innerHTML = 'L\'aliment a été supprimé avec succès';

            let rowAliement = document.querySelector('#alimentRow'+idAliment);
            rowAliement.remove();
            return true;

        } else {

            alimentAlert.classList.remove('d-none')
            alimentAlert.classList.add('alert-danger')
            alimentAlert.innerHTML = 'Error : ' + data.code +'<br>'
            alimentAlert.innerHTML += data.message;
            return false;

        }

        return false;

    }).then(data => {return data});

    colse-del-modal.click();
    confirmDeletionBtn.removeEventListener("click", func);
});