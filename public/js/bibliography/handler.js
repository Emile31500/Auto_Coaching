const addBliblioGraphie = document.querySelector('#addBliblioGraphie');
const biblioList = document.querySelector('#biblioList');
const btnsDelete = document.querySelectorAll('button[name="delete_bibliography"]');

btnsDelete.forEach(btnDelete => {
    btnDelete.removeEventListener('click', deleteBibliographyWrapper)
    btnDelete.addEventListener('click', deleteBibliographyWrapper)
});


function deleteBibliography (e){
    
    e.preventDefault();
    this.parentElement.parentElement.classList.add('d-none')
    this.parentElement.parentElement.querySelector('input[name="isDeleted"]').setAttribute('value', 'true')

}

function deleteBibliographyWrapper(event){
    
    deleteBibliography.call(this, event)
}




addBliblioGraphie.addEventListener('click', function (e) {
    
    e.preventDefault();
    
    const newBiblioUrlElement = document.createElement("input")
    newBiblioUrlElement.setAttribute('type', "text")
    newBiblioUrlElement.setAttribute('name', "bibliography_urls")
    newBiblioUrlElement.setAttribute('class', "form-control col-auto")
    newBiblioUrlElement.setAttribute('placeholder', "titre")

    const newBiblioLibeleElement = document.createElement("input")
    newBiblioLibeleElement.setAttribute('type', "text")
    newBiblioLibeleElement.setAttribute('name', "bibliography_libeles")
    newBiblioLibeleElement.setAttribute('class', "form-control col-auto")
    newBiblioLibeleElement.setAttribute('placeholder', "titre")

    const newIsDeleteElement = document.createElement("input")
    newIsDeleteElement.setAttribute('type', "hidden")
    newIsDeleteElement.setAttribute('name', "bibliography_isDeleted")

    const newBtnDelete = document.createElement("button")
    newBtnDelete.innerHTML = 'Supprimer'
    newBtnDelete.setAttribute('class', "btn btn-danger mx-3")
    newBtnDelete.setAttribute('name', 'delete_bibliography')


    const divContainer = document.createElement('div')
    divContainer.setAttribute('class', "d-flex")

    const colContainerUrl = document.createElement('div')
    colContainerUrl.setAttribute('class', "w-100")
    colContainerUrl.appendChild(newBiblioUrlElement)

    const colContainerLibele = document.createElement('div')
    colContainerLibele.setAttribute('class', "w-100")
    colContainerLibele.appendChild(newBiblioLibeleElement)
    colContainerLibele.appendChild(newIsDeleteElement)


    const colContainerDelete = document.createElement('div')
    colContainerDelete.appendChild(newBtnDelete)

    divContainer.appendChild(colContainerLibele)
    divContainer.appendChild(colContainerUrl)
    divContainer.appendChild(colContainerDelete)


    biblioList.appendChild(divContainer)
    
    document.querySelectorAll('button[name="delete_bibliography"]').forEach(btnDelete => {
        btnDelete.removeEventListener('click', deleteBibliographyWrapper)
        btnDelete.addEventListener('click', deleteBibliographyWrapper)
    });


})

