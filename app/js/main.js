import Header from './nodes/Header'
import Menu from './nodes/Menu'
import Carousel from './nodes/Carousel'
import ThreeSlideShow from './nodes/ThreeSlideShow'

const classes = {
	Header,
    Menu,
	ThreeSlideShow,
	Carousel
};

class Proxy {
    constructor (className, opts) {
        return new classes[className](opts);
    }
}

class Main{
	constructor(){
        this.node = window
        
        window.addEventListener( 'mousemove', this.mouseMove.bind( this ), false )
        window.addEventListener( 'mousedown', this.mouseDown.bind( this ), false )
        window.addEventListener( 'resize', this.resize.bind( this ), false )
        window.addEventListener( 'scroll', this.scroll.bind( this ), false )
        
        this.views = {}
		
		var jsMods = document.getElementsByClassName('jsmodule')
		Object.values( jsMods ).forEach( v => this.views [ v.dataset.classname ] = new Proxy( v.dataset.classname, v ) )

		this.resize()
		this.step()
	}

	scroll( e ){
		var doc = document.documentElement
		var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0)
		Object.values( this.views ).forEach( v => { v.scroll && v.scroll( top ) } )
	}

	mouseMove( e ){
		Object.values( this.views ).forEach( v => { v.mouseMove && v.mouseMove( e ) } )
	}

	mouseDown( e ){
		Object.values( this.views ).forEach( v => { v.mouseDown && v.mouseDown( e ) } )
	}

	resize( ){
		let [ width, height ] = [ this.node.innerWidth, this.node.innerHeight ]
		Object.values( this.views ).forEach( v => { v.resize && v.resize( width, height ) } )
	}

	step( time ){
		window.requestAnimationFrame( this.step.bind( this ) )
		Object.values( this.views ).forEach( v => { v.step && v.step( time ) } )
	}
}

new Main()