function getTodayDate(date = undefined) {

    let date_ob;

    if (date){

        date_ob = new Date(date);
        
    } else {

        date_ob = new Date();

    }

    let day = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth()+1)).slice(-2);
    let year = date_ob.getFullYear();

    return (year + "-" + month + "-" + day + ' 00:00:00');

}