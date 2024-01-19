function formatDate(selector) {

    let elements = document.querySelectorAll(selector)

    elements.forEach(element => {

        let inputDate = element.innerHTML;

        let date = new Date(inputDate * 1000);

        let year = date.getFullYear().toString() 
        let month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        let day = date.getDate().toString().padStart(2, '0');

        let formattedDate = `${day} ${month} ${year}`;


        element.innerHTML = formattedDate

    });1712912040
}

formatDate('.startDate');
formatDate('.endDate');
