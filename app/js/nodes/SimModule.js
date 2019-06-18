class SimModule {
	constructor( node ){
        this.node = node
        this.node.addEventListener( 'mousedown', this.getLink.bind( this ) )
    }

    getLink(){
        window.location = ( window.location.href.indexOf("localhost") >= 0 ) ? 'simulator.html' : 'simulator';
    }
}

export { SimModule as default }