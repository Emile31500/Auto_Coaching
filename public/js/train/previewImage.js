
const input = document.querySelector("[name='imageUrl']");
const preview = document.getElementById('imageVisualisation');

input.addEventListener('change', function () {
    const file = this.files[0];
    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){
        preview.style.backgroundImage = `url("${e.target.result}")`;
    }

    reader.readAsDataURL(file);
});