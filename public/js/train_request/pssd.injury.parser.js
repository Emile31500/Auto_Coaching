    var delete_inj = document.querySelectorAll(".delete-inj ")

    var indexInj = 0;
    var passedInjs = [];
    addInj.addEventListener('click', function (event){

        event.preventDefault();
        passedInjs.push(JSON.stringify({
                name : passed_inj_name.value,
                description: inj_description.value,
                alreadyEmbarrased: alrd_embarrased.value,
                date : injDate.value,
               
        }));
        
        passedInjListElements.innerHTML += '<div id="inj-zone-'+indexInj+'" class="border border-light p-3 my-3"><div class="row"><div class="col-4"><div>' + passedInjName.value + '</div><div>' + injDate.value + ' </div></div><div class="col-8"><div>' + inj_description.value +'</div> <div>' + alrd_embarrased.value + '</div>  </div></div><div class="d-flex justify-content-end"><span indexInj="'+ indexInj + '" class="delete-inj btn btn-outline-danger"> x </span></div></div>'
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