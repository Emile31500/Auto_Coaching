var delete_sport = document.querySelectorAll(".delete-sport ")

var index = 0;
var passedSports = [];
addSport.addEventListener('click', function (event){

    event.preventDefault();
    passedSports.push(JSON.stringify({
            name : passed_sport_name.value,
            description: sport_description.value,
            startDate : start_date.value,
            endDate: end_date.value
           
    }));
    
    passedSportListElements.innerHTML += '<div id="sport-zone-'+index+'" class="border border-light p-3 my-3"><div class="row"><div class="col-3">' + passed_sport_name.value + ' </div><div class="col-3">' +  start_date.value + ' ' +  end_date.value + '</div> <div class="col-5">' + sport_description.value +'</div></div><div class="d-flex justify-content-end"><span index="'+ index + '" class="delete-sport btn btn-outline-danger"> x </span></div></div>'
    delete_sport = document.querySelectorAll(".delete-sport ");
    

    delete_sport.forEach(delBtn => {

        delBtn.addEventListener("click", function (event){
            
            event.preventDefault();

            let selector = '#sport-zone-'+delBtn.getAttribute('index');
            document.querySelector(selector).remove();
            passedSports[delBtn.getAttribute('index')] = '';

        });

    });

    index++;

});