import { TSMethodSignature } from "babel-types";

class Carousel {
	constructor( node ){
        this.node = node

        this.imgs = []
        this.currentImage = 0

        // left but
        this.leftBut = document.createElement( 'a' )
        this.leftBut.setAttribute( 'href', 'javascript:void(0)' )
        this.leftBut.className = 'nav left'
        this.node.appendChild( this.leftBut )
        this.leftBut.addEventListener( 'click', evt => this.prevImage( evt ) )

        // right but
        this.rightBut = document.createElement( 'a' )
        this.rightBut.className = 'nav right'
        this.rightBut.setAttribute( 'href', 'javascript:void(0)' )
        this.node.appendChild( this.rightBut )
        this.rightBut.addEventListener( 'click', evt => this.nextImage( evt ) )

        // slider

        this.outer = document.createElement( 'div' )
        this.outer.className = 'outer'
        this.node.appendChild( this.outer )

        this.slider = document.createElement( 'div' )
        this.slider.className = 'slider'
        this.outer.appendChild( this.slider )

        var imgList = this.node.getElementsByTagName( 'img' )
        Object.values( imgList ).forEach( img => {
            this.imgs.push( img )
            img.parentNode.removeChild( img )

            var im = document.createElement( 'div' )
            im.className = 'img'
            this.slider.appendChild( im )
            im.style['background-image'] = 'url(' + img.getAttribute( 'src' ) + ')'
            
        })
	}

    prevImage( e ){
        if( this.currentImage > 0 ) this.currentImage--
        this.updateSlider()
    }

    nextImage( e ){
        if( this.currentImage < this.imgs.length - 1 ) this.currentImage++
        this.updateSlider()
    }

    updateSlider( ){
        this.slider.style.transform = 'translate3d( ' + -this.currentImage * this.node.offsetWidth + 'px, 0px, 0px )'
    }

	step( time ){
       
	}
}

export { Carousel as default }