/*deleteAteFoodBtns =  document.querySelectorAll('.delete-ate-food-btn');
responseFoodAteRequest = document.querySelector('#responseFoodAteRequest')
deleteAteFoodBtns.forEach(deleteAteFoodBtn => {

    console.log(deleteAteFoodBtn)
    deleteAteFoodBtn.addEventListener('click', function () {


        let idAteFood = this.getAttribute('data-id-food')
        console.log(idAteFood);



        const url = '/api/food/ate/'+idAteFood
        console.log(url);
        
        fetch(url, {

            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}

        }).then(response => {
                
            if (response.status === 204) {

                responseFoodAteRequest.classList.remove('d-none')
                responseFoodAteRequest.classList.add('alert-success')
                responseFoodAteRequest.innerHTML = 'L\'aliment a été supprimé avec succès';
                deleteAteFoodBtn.parentElement.parentElement.remove();
            }

            return response.json();


        }).then(data => {
            
            responseFoodAteRequest.classList.remove('d-none')
            responseFoodAteRequest.classList.add('alert-danger')
            responseFoodAteRequest.innerHTML = 'Error : ' + data.code +'<br>'
            responseFoodAteRequest.innerHTML += data.message;


        });
            
    })
}); */
