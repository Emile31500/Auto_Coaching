function printFoods (foods) {

    htmlTable = ''

    if (foods.length > 0) {

        foods.forEach(food => {

            htmlTable += '<tr><th scope="row">' + food.name+ '</th>'
            htmlTable += '<td> ' + Math.round(food.carbohydrate *4.063 + food.proteine *4.063 + food.fat*9.08222) + ' kcal </td>'
            
            
            if (isAdmin){ 
                
                htmlTable += '<td> ' + food.carbohydrate + ' g </td><td> ' + food.sugar + ' g </td><td> '+ food.proteine +' g </td><td> ' +food.fat + 'g </td><td> ' +food.trans_fat + 'g </td>'
                htmlTable += '<td> <button class=\'delAlimentBtns btn btn-danger\' data-bs-toggle=\'modal\' data-bs-target=\'#confirmDel\' data-id-aliment=\''+ food.id +'\'>Supprimer</button>  <button class="btn btn-outline-secondary edit-aliment" data-macro-nutrient=\'{"name" : '+ food.name +'","protein" : ' + food.proteine +',"fat" : '+ food.fat +',"trans_fat" : '+ food.trans_fat +',"carbohydrate" : '+ food.carbohydrate +', "sugar" : '+ food.sugar +', "is_egg" : '+ food.is_egg +', "is_meat" : '+ food.is_meat +', "is_milk" : '+ food.is_milk +'}\' data-id-aliment=\''+ food.id + '\'>éditer</button> </td></tr>'  

            } else {
                htmlTable += '<td> ' + food.carbohydrate + ' g </td><td> '+ food.proteine +' g </td><td> ' +food.fat + 'g </td>'
                htmlTable += '<td><form action="/api/food/ate" class="alimentForms" method="post"><div class="row"  style="max-width: 200px;"><input type="number" name="foodId" hidden value="' +food.id +'" >'
                htmlTable += '<div class="col"><input type="number" name="weight" class="form-control" placeholder="g / ml"> </div><div class="col-3"><input type="submit" class="btn btn-primary" value="+"/></div></div></form></td></tr>';

            }
        });
        
    } else {

        htmlTable = '<div class=\'alert alert-warning m-5\'> Warning : <br>No food found for "'+ alimentNameSearch.value+ '".</div>'

    }

    foodTableBody.innerHTML = htmlTable

}