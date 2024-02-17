function printFoods (foods) {

    htmlTable = ''

    foods.forEach(food => {

    
        htmlTable += '<tr><th scope="row">' + food.name+ '</th>'
        htmlTable += '<td> ' + Math.round(food.carbohydrate *4.063 + food.proteine *4.063 + food.fat*9.08222) + ' kcal </td>'
        htmlTable += '<td> ' + food.carbohydrate + ' g </td><td> '+ food.proteine +' g </td><td> ' +food.fat + 'g </td>'
        htmlTable += '<td><form action="/api/food/ate" class="alimentForms" method="post"><div class="row"  style="max-width: 200px;"><input type="number" name="foodId" hidden value="' +food.id +'" >'
        htmlTable += '<div class="col"><input type="number" name="weight" class="form-control" placeholder="g / ml"> </div><div class="col-3"><input type="submit" class="btn btn-primary" value="+"/></div></div></form></td></tr>';
        
    });

    foodTableBody.innerHTML = htmlTable

}