let trainList = document.querySelector('#trainList')

fetch('/api/train', {
    method: 'GET',
    headers:{
        'Content-Type': 'application/json'
    }
}).then(response=>response.json())
.then(data => {

    console.log(data)
    if (data.code === 200){
    
        data.data.forEach(train => {

            trainList.innerHTML = '<tr><td><span>' + train.name + '</span></td><td><button type="button" data-id-train="' + train.id + '" class="btn btn-success"> Play</button></th></tr>';
            
        });
    
    } else {

        alert('error')
    }


});