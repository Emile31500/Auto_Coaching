const pngGifImgs = document.querySelectorAll(".png-gif-img")
pngGifImgs.forEach(pngGifImg => {

    pngGifImg.addEventListener('mouseenter', function() {
        
        let src =  this.getAttribute('src')
        const newSrc = src.replace('.png', '.gif')
        
        console.log(src)
        console.log(newSrc)
        
        this.setAttribute('src', newSrc)
    })

    pngGifImg.addEventListener('mouseout', function() {
        
        let src =  this.getAttribute('src')
        const newSrc = src.replace('.gif', '.png')
        
        console.log(src)
        console.log(newSrc)
        
        this.setAttribute('src', newSrc)
    })

})
