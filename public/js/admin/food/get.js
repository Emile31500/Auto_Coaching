async function getAllFood () {

    tableHTML = ''

    const foods = await fetch ('/api/admin/food', {

        method: 'GET',
        headers: {
            'Content-type' : 'application/json'
        }
    
    }).then(response => response.json())
    .then(data => {
    
        if (data.code === 200){
    
            return data.data
    
        }
    
    })

    foods.forEach(food => {
        
        tableHTML += '<tr id=\'alimentRow'+ food.id + '\'>'
        tableHTML += '<th scope="row">' +  food.name + '</th>'
        tableHTML += '<td> ' +   Math.round(food.carbohydrate *4.063+ food.proteine *4.063 + food.fat*9.08222)  + ' kcal </td>'
        tableHTML += '<td> ' +  food.carbohydrate + ' g </td>'
        tableHTML += '<td> ' +  food.sugar + ' g </td>'
        tableHTML += '<td> ' +  food.proteine + ' g </td>'
        tableHTML += '<td> ' +  food.fat + ' g </td>'
        tableHTML += '<td> ' +  food.trans_fat + ' g </td>'
        tableHTML += '<td> <button class=\'delAlimentBtns btn btn-danger\' data-bs-toggle=\'modal\' data-bs-target=\'#confirmDel\' data-id-aliment=\''+ food.id +'\'>Supprimer</button>  <button class="btn btn-outline-secondary edit-aliment" data-macro-nutrient=\'{"name" : '+ food.name +'","protein" : ' + food.proteine +',"fat" : '+ food.fat +',"trans_fat" : '+ food.trans_fat +',"carbohydrate" : '+ food.carbohydrate +', "sugar" : '+ food.sugar +', "is_egg" : '+ food.is_egg +', "is_meat" : '+ food.is_meat +', "is_milk" : '+ food.is_milk +'}\' data-id-aliment=\''+ food.id + '\'>éditer</button> </td></tr>'

    });

    alimentTable.innerHTML = tableHTML

}