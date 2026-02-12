fetch('/api/train', {
    method: 'GET',
    headers:{
        'Content-Type': 'application/json'
    }
}).then(response=>response.json())
.then(data => {

    if (data.code === 200){
    
        data.data.forEach(async (train) => {

            let url = '/api/train/' +train.id + '/day'

            await fetch(url, {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json'
                }
            }).then(response=>response.json())
            .then(data => {

                if (data.code === 200) {

                     data.data.forEach((days) => {

                        trainList.innerHTML = '<tr><td><span>' + train.name + '</span></td><td><a href=\'/train/' + train.id + '/play/'+ days.day+'\' ><button type="button" data-id-train="' + train.id + '" class="btn btn-success"> Play</button></th></tr>';

                    }); 

                }

            });

        });
    
    } else {

        alert('error')
    }

});
