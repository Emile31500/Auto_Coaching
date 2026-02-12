function getTodayDate(date = undefined) {

    let date_ob;
    let monthAdditioner = 0
    if (date){

        date_ob = new Date(date);
        
    } else {

        date_ob = new Date();
        monthAdditioner = 1

    }

    let day = date_ob.getDate();
    let month = date_ob.getMonth()+monthAdditioner;

    if (month < 10) {

        month = "0" + month
    }
    if (day < 10) {

        day = "0" + day
    }

    let year = date_ob.getFullYear();

    return (year + "-" + month + "-" + day);

}

function getTodayDateTime(date = undefined) {
    
    let date_ob;
    let monthAdditioner = 0
    let hoursAdditioner = 0

    if (date){
        date_ob = new Date(date);
    } else {
        date_ob = new Date();
        monthAdditioner = 1
        hoursAdditioner = 1

    }

    let day = date_ob.getDate();
    let month = date_ob.getMonth()+monthAdditioner;
    let year = date_ob.getFullYear();

    let hours = date_ob.getHours()+hoursAdditioner;
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

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
