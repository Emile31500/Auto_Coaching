var addInj = document.querySelector("#addInj");
    var passedInjName = document.querySelector("#passed_inj_name");
    var injDate = document.querySelector("#injDate");
    var passedInjListElements= document.querySelector("#passedInjListElements")
    var delete_inj = document.querySelectorAll(".delete-inj ")
    var injDescription = document.querySelector('#inj-description');
    var alrd_embarrased = document.querySelector('#alrd-embarrased')

    var indexInj = 0;
    var passedInjs = [];
    addInj.addEventListener('click', function (event){

        event.preventDefault();
        passedInjs.push(JSON.stringify({
                name : passedInjName.value,
                description: injDescription.value,
                alreadyEmbarrased: alrd_embarrased.value,
                date : injDate.value,
               
        }));
        
        passedInjListElements.innerHTML += '<div id="inj-zone-'+indexInj+'" class="border border-light p-3 my-3"><div class="row"><div class="col-4"><div>' + passedInjName.value + '</div><div>' + injDate.value + ' </div></div><div class="col-8"><div>' + injDescription.value +'</div> <div>' + alrd_embarrased.value + '</div>  </div></div><div class="d-flex justify-content-end"><span indexInj="'+ indexInj + '" class="delete-inj btn btn-outline-danger"> x </span></div></div>'
        delete_inj = document.querySelectorAll(".delete-inj");
        

        delete_inj.forEach(delBtn => {

            delBtn.addEventListener("click", function (event){
                
                event.preventDefault();

                let selector = '#inj-zone-'+delBtn.getAttribute('indexInj');
                document.querySelector(selector).remove();
                passedInjs[delBtn.getAttribute('indexInj')] = '';

            });

        });

        index++;

    });