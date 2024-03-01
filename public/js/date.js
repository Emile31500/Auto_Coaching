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


function getTodayDateTime(date = undefined) {
    
    let date_ob;

    if (date){
        date_ob = new Date(date);
    } else {
        date_ob = new Date();
    }

    let day = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth()+1)).slice(-2);
    let year = date_ob.getFullYear();

    let hours = ("0" + date_ob.getHours()).slice(-2);
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);
    let seconds = ("0" + date_ob.getSeconds()).slice(-2);

    return (year + "-" + month + "-" + day + ' ' + hours + ':' + minutes + ':' + seconds);
}


function getTomorowDate(date = undefined) {

    let date_ob;

    if (date){

        date_ob = new Date(date);
        
    } else {

        date_ob = new Date();

    }

    let day = ("0" + date_ob.getDate()+1).slice(-2);
    let month = ("0" + (date_ob.getMonth()+1)).slice(-2);
    let year = date_ob.getFullYear();

    return (year + "-" + month + "-" + day + ' 00:00:00');

}
   
function calculateAge(birthDay) {

    const birthDate = new Date(birthDay);

    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const hasBirthdayOccurred = (
        currentDate.getMonth() > birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate()) ||
        (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() === birthDate.getDate() && currentDate.getHours() >= birthDate.getHours()) ||
        (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() === birthDate.getDate() && currentDate.getHours() === birthDate.getHours() && currentDate.getMinutes() >= birthDate.getMinutes()) ||
        (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() === birthDate.getDate() && currentDate.getHours() === birthDate.getHours() && currentDate.getMinutes() === birthDate.getMinutes() && currentDate.getSeconds() >= birthDate.getSeconds())
    );

    if (hasBirthdayOccurred) {

        age = age - 1;
        
    }

    const intAge = age;
    return intAge;
}
