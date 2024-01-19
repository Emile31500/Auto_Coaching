let boutonOnglet = document.querySelectorAll(".boutonOnglet");

boutonOnglet.forEach(bouton => {


    bouton.addEventListener('click', function(){
        
        document.querySelector(".boutonOnglet.active").classList.remove('active')

        bouton.classList.add('active');
        let ongletId = bouton.getAttribute('onglet');
        let onglet = document.querySelector('#' + ongletId);
        let ongletsProfille = document.querySelectorAll('.ongletsProfile');

        ongletsProfille.forEach(ongletProfille => {

            ongletProfille.classList.add('d-none');

        });

        onglet.classList.add('d-block');
        onglet.classList.remove('d-none');


    });

})
