import Menu from './nodes/Menu'
import Footer from './nodes/Footer'
import ThreeLayer from './nodes/ThreeLayer'

class Main{
	constructor(){
        this.node = window
        
		window.addEventListener( 'mousemove', this.mouseMove.bind( this ), false )
        window.addEventListener( 'mousedown', this.mouseDown.bind( this ), false )
        window.addEventListener( 'resize', this.resize.bind( this ), false )
        
        this.views = {
            threeLayer : new ThreeLayer( document.getElementById('three') ),
            menu : new Menu( document.getElementById('menu') ),
            footer : new Footer( document.getElementById('footer') )
        }

		this.resize()
		this.step()
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