    const addBliblioGraphie = document.querySelector('#addBliblioGraphie');
    const biblioList = document.querySelector('#biblioList');

    console.log('linked')

    addBliblioGraphie.addEventListener('click', function (e) {
        e.preventDefault();
        
        const newBiblioLibeleElement = document.createElement("input")
        newBiblioLibeleElement.setAttribute('type', "text")
        newBiblioLibeleElement.setAttribute('name', "libele")
        newBiblioLibeleElement.setAttribute('class', "form-control col-auto")
        newBiblioLibeleElement.setAttribute('placeholder', "titre")

        const newBiblioUrlElement = document.createElement("input")
        newBiblioUrlElement.setAttribute('type', "text")
        newBiblioUrlElement.setAttribute('name', "bibliographies")
        newBiblioUrlElement.setAttribute('class', "form-control col-auto")
        newBiblioUrlElement.setAttribute('placeholder', "url")

        const divContainer = document.createElement('div')
        divContainer.setAttribute('class', "row my-1")

        const colContainerUrl = document.createElement('div')
        colContainerUrl.setAttribute('class', "col")
        colContainerUrl.appendChild(newBiblioUrlElement)

        const colContainerLibele = document.createElement('div')
        colContainerLibele.setAttribute('class', "col")
        colContainerLibele.appendChild(newBiblioLibeleElement)

        divContainer.appendChild(colContainerLibele)
        divContainer.appendChild(colContainerUrl)

        biblioList.appendChild(divContainer)        
    })