class Menu {
	constructor( node ){
        this.node = node
        this.pattern = this.node.getElementsByClassName( 'pattern' )[ 0 ]
        this.inner = this.node.getElementsByClassName( 'inner' )[ 0 ]

        Array.from( this.node.getElementsByClassName( 'but' ) ).forEach( e => {
            e.addEventListener( 'mouseenter', this.mouseEnter.bind( this ) )
            e.addEventListener( 'mouseleave', this.mouseLeave.bind( this ) )
        });
        
        this.hoverActive = false
	}

    mouseEnter( e ){
        
        this.hoverActive = true
        
        if( this.mouseOutTimer ) {
            clearTimeout( this.mouseOutTimer )
            this.mouseOutTimer = null
        }
        this.lines = []
        this.node.className = e.target.dataset.item
        
        this.inner.innerHTML = ''
        var line = document.createElement( 'div' )
        line.classList.add( 'line' )
        var lineBuffer = 4
        for( var i = 0 ; i < 20 ; i++ ) line.innerHTML += '<span>' + e.target.innerHTML + ' </span>'
        
        while( this.inner.offsetHeight < ( this.pattern.offsetHeight ) ) this.inner.appendChild( line.cloneNode(true) )
        for( var i = 0 ; i < lineBuffer ; i++ ) this.inner.appendChild( line.cloneNode(true) )

        Array.from( this.inner.childNodes ).forEach( e => {
            e.style['margin-left'] = -500 - Math.random() * 200 + 'px'
            this.lines.push({
                el : e,
                p : 0,
                s : Math.random() - 0.5,
                w : e.childNodes[ 0 ].offsetWidth
            })
        });

        var lineHeightOffset = this.inner.childNodes[0].offsetHeight * lineBuffer * 0.5
        this.inner.style.transform = 'translate3d( -100px, -' + lineHeightOffset + 'px, 0px )'
    }

    mouseLeave( e ){
        if( !this.mouseOutTimer ) this.mouseOutTimer = setTimeout( this.mouseOut.bind( this ), 200 )
    }

    mouseOut( ){
        this.hoverActive = false
        this.inner.innerHTML = ''
        this.node.className = ''
    }

	step( time ){
        if( !this.hoverActive ) return
        this.lines.forEach( l => {
            l.p += l.s * 2
            if( Math.abs( l.p ) >= l.w ) l.p = 0
            l.el.style.transform = 'translate3d( ' + l.p + 'px, 0px, 0px )'
        });
	}
}

export { Menu as default }