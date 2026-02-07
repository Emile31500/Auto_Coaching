function initPrintDetail() {


    let getDetailBtns =  document.querySelectorAll('.get-detail');
    let detailFoodModal = document.querySelector('#detailFoodModal')

    getDetailBtns.forEach(getDetailBtn => {

        getDetailBtn.addEventListener('click', function name(event) {

            event.preventDefault();

            tr = this.parentElement.parentElement;

            detailFoodModal.querySelector('.kcal').value = tr.querySelector('.kcal').innerHTML;
            detailFoodModal.querySelector('.protein').value = tr.querySelector('.protein').innerHTML;
            detailFoodModal.querySelector('.fat').value = tr.querySelector('.fat').innerHTML;
            detailFoodModal.querySelector('.carbo').value = tr.querySelector('.carbo').innerHTML;

            this.click();
            
        })
        
    });
}

initPrintDetail()