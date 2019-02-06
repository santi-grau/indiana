class Modal {
	constructor( node, target ){
        this.node = node
        
        this.node.getElementsByClassName( 'close' )[ 0 ].addEventListener( 'click', this.close.bind( this ) )

        this.node.classList.add( 'active' )
    }

    close(){
        this.node.classList.remove( 'active' )
    }
}

export { Modal as default }