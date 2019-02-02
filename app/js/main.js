import Menu from './nodes/Menu'

class Main{
	constructor(){
        this.node = window

		window.addEventListener( 'mousemove', this.mouseMove.bind( this ), false )
        window.addEventListener( 'mousedown', this.mouseDown.bind( this ), false )
        window.addEventListener( 'resize', this.resize.bind( this ), false )
        
        this.menu = new Menu( document.getElementById('menu') )
        
		this.resize()
		this.step()
	}

	mouseMove( e ){
        this.menu.mouseMove && this.menu.mouseMove( e )
	}

	mouseDown( e ){
		this.menu.mouseDown && this.menu.mouseDown( e )
	}

	resize( ){
        let [ width, height ] = [ this.node.innerWidth, this.node.innerHeight ]
        this.menu.resize && this.menu.resize( width, height )
	}

	step( time ){
        window.requestAnimationFrame( this.step.bind( this ) )
        this.menu.step( time )
	}
}

new Main()