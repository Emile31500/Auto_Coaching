let editAliments = document.querySelectorAll('.edit-aliment')
let idAliment;

editAliments.forEach(editAliment => {

    editAliment.addEventListener('click', function(event){

        document.querySelectorAll('.table-warning').forEach(row => { row.classList.remove('table-warning')});
        
        let macroNutrients = editAliment.getAttribute('data-macro-nutrient');
        idAliment = editAliment.getAttribute('data-id-aliment');

        let jsonMacroNutrients = JSON.parse(macroNutrients);
        
        isUpdated.checked = true;
        nameAliment.value = jsonMacroNutrients.name;
        proteinEl.value = jsonMacroNutrients.protein;
        sugarEl.value = jsonMacroNutrients.sugar;
        fatEl.value = jsonMacroNutrients.fat;
        transFatEl.value = jsonMacroNutrients.trans_fat;
        carbohydrateEl.value = jsonMacroNutrients.carbohydrate;
        idFoodEl.value = idAliment;
        isMeatEl.checked = jsonMacroNutrients.is_meat;
        isEggEl.checked = jsonMacroNutrients.is_egg;
        isMilkEl.checked = jsonMacroNutrients.is_milk;
        //sugar.value = jsonMacroNutrients.;

        let selector = '#alimentRow'+idAliment;
        isUpdated.setAttribute('checked', 'true')
        document.querySelector(selector).classList.add('table-warning')

    })

});