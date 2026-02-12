const idRecipient = idReciepientElement.innerHTML
idReciepientElement.remove()
let sinceDate = '2024-01-01'
let ding = new Audio('/media/audio/mixkit-message-pop-alert-2354.mp3');

async function getMesssage(){

    const res = await fetch('/api/admin/message/' + idRecipient + '/since/' + sinceDate , {
        method : 'GET',
        headers : {
            'Content-Type' : 'application/json'
        }
    }).then(response => {

        return response.json()

    }).then(data => {

        if (data.code === 200) {

            return data.data

        } else {

            return false;

        }
    })

    return res;
}


async function wrightMessageSince() {

    let htmlMessage = '';
    const messages = await getMesssage();

    if (messages.length > 0){

        ding.play();
        sinceDate = messages[messages.length-1].createdAt
        user = await getAuthenticatedUser()

        messages.forEach(message => {

            let dateCreation = new Date(message.createdAt)
            let htmlDate = dateCreation.getHours() + ":" + dateCreation.getMinutes() + ", " + dateCreation.getDate() +" / " + dateCreation.getMonth();

            
            if (message.userId === user.id ) {
    
                htmlMessage += "<li class='clearfix'><div class='message-data text-end'><span class='message-data-time'>" + htmlDate + "</span><img src='https:ootdey.com/img/Content/avatar/avatar7.png' alt='avatar'></div><div class='message other-message float-right'>" + message.message +  "</div></li>";
    
            } else {
    
                htmlMessage += "<li class='clearfix'><div class='message-data'><span class='message-data-time'>" + htmlDate + "</span></div><div class='message my-message'>" + message.message + "</div></li>";
    
            }
        });

        messageHistoryZone.innerHTML += htmlMessage;

    }
}

wrightMessageSince();
setInterval(async () => { 
    await wrightMessageSince()

}, 3000);
