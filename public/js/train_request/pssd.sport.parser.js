
var trainRequestForm = document.querySelector('#trainRequestForm');
var addSport = document.querySelector("#addSport");
var birthDay = document.querySelector('#birth_day');
var objectif = document.querySelector('#objectif');
var passedSportName = document.querySelector("#passed_sport_name");
var startDate = document.querySelector("#start_date");
var endDate = document.querySelector("#end_date");
var passedSportListElements= document.querySelector("#passedSportListElements")
var delete_sport = document.querySelectorAll(".delete-sport ")
var trainRequestAlert = document.querySelector('#trainRequestAlert');
var sportDescription = document.querySelector('#sport-description');

var index = 0;
var passedSports = [];
addSport.addEventListener('click', function (event){

    event.preventDefault();
    passedSports.push(JSON.stringify({
            name : passedSportName.value,
            description: sportDescription.value,
            startDate : startDate.value,
            endDate: endDate.value
           
    }));
    
    passedSportListElements.innerHTML += '<div id="sport-zone-'+index+'" class="border border-light p-3 my-3"><div class="row"><div class="col-3">' + passedSportName.value + ' </div><div class="col-3">' +  startDate.value + ' ' +  startDate.value + '</div> <div class="col-5">' + sportDescription.value +'</div></div><div class="d-flex justify-content-end"><span index="'+ index + '" class="delete-sport btn btn-outline-danger"> x </span></div></div>'
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