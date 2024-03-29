sendButton.addEventListener('click', async function (event){

    event.preventDefault();
    message = messageInput.value;
    const todayDateTime =  getTodayDateTime()

    const rawData = JSON.stringify({
        userId : null,
        message : message,
        isViewed : false,
        isDelated : false,
        createdAt : todayDateTime,
        updatedAt : todayDateTime,
        userIdRecipient : null
    });

    const res = await fetch('/api/admin/message/' + idRecipient , {
        method : 'POST',
        headers : {
            'Content-type' : 'application/json'
        },
        body : rawData
    }).then(response => {return response.json()})
    .then(data => {
        return data;
    })
    
    let sinceDate = getTodayDateTime();
    await wrightMessageSince(sinceDate)
    
    messageInput.value = ''
    if (201 !== res.code){

        alert('error')    

    }

})