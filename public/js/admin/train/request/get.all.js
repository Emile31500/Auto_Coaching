
async function getUser(userId) {

    const promise = await fetch('/api/user?id='+userId, {

        method: 'GET',
        headers: {'Content-Type' : 'application/json'},

    })

    let res = await promise.json();

    if (res.code === 200) {

        return res.data;

    } else {

        console.log('Error : ' +  res.code + '\n' + res.message)

    }
    
}

fetch('/api/admin/train/request', {

    method: 'GET',
    headers: {'Content-Type' : 'application/json'}

}).then(response => response.json())
.then(data => {

    if (data.code === 200) {

        data.data.forEach(trainRequest => {

            let utilisateur = getUser(trainRequest.userId);
            let age = calculateAge(trainRequest.birthDay)

            utilisateur.then(utilisateur => { 
            
                bodyTrainRequestTable.innerHTML +='<tr><td>' + utilisateur.name + '</td><td>'+utilisateur.email +'</td><td>'+trainRequest.objectif+'</td><td>'+trainRequest.metabolism+'</td><td>' + age + '</td><td><a href="/admin/train/request/' + trainRequest.id + '">Détail</a></td></tr>';                 
            
            });
        });

    }

});