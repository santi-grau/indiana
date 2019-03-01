class Header {
	constructor( node ){
        this.node = node

        this.title = document.getElementById( 'title' )
        this.moveSpeed = 3
        this.scrollTop = null
        this.prevScroll = null
        this.scrollEased = null
        this.scrollDir = null
	}

    scroll( scroll ){
        if( !this.prevScroll ) return this.prevScroll = scroll

        this.scrollTop = scroll
        
        if( this.prevScroll < this.scrollTop ) this.scrollDir = 1
        else this.scrollDir = -1
        this.prevScroll = scroll
    }

    computeScroll( ){
        if( !this.scrollEased ) return this.scrollEased = this.scrollTop
        this.scrollEased += ( this.scrollTop - this.scrollEased ) * 0.1
    }

    updateHeader( ){
        if( this.scrollDir > 0 ){
            if( this.scrollEased > 100 ) this.node.classList.remove( 'active' )
            else this.node.classList.add( 'active' )
        } else {
            if( !document.body.classList.contains( 'menuDown' ) ) this.node.classList.add( 'active' )
        }

        if( this.scrollTop ){
            var dim = 0.5 + 0.5 * ( 1 - Math.min( 1, ( this.scrollTop ) / 100 ) )
            this.title.style.transform = 'scale( ' + dim + ' )'
        }   
    }

	step( time ){
        this.computeScroll( )
        this.updateHeader( )
	}
}

export { Header as default }