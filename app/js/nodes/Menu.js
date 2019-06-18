class Menu {
	constructor( node ){
        this.node = node
        this.pattern = this.node.getElementsByClassName( 'pattern' )[ 0 ]
        this.inner = this.node.getElementsByClassName( 'inner' )[ 0 ]
        this.hamburger = this.node.getElementsByClassName( 'hamburger' )[ 0 ]
        this.moveSpeed = 3
        
        Array.from( this.node.getElementsByClassName( 'but' ) ).forEach( e => {
            e.addEventListener( 'mouseenter', this.mouseEnter.bind( this ) )
            e.addEventListener( 'mouseleave', this.mouseLeave.bind( this ) )
            e.addEventListener( 'mousedown', this.butDown.bind( this ) )
        })

        this.hamburger.addEventListener( 'mousedown' , this.openMenu.bind( this ) )
        this.hoverActive = false
	}

    openMenu( e ){
        if( !this.node.classList.contains( 'active' ) ){
            this.node.classList.add( 'active' )
            document.body.classList.add( 'menuMobile' )
        } else {
            this.node.classList.remove( 'active' )
            document.body.classList.remove( 'menuMobile' )
        }
    }

    butDown( e ){
        document.body.classList.add( 'menuDown' )
        // if( this.menuTimeout ) clearTimeout( this.menuTimeout )
        // this.menuTimeout = setTimeout( e => document.body.classList.remove( 'menuDown' ), 1000 )
        if( !document.body.classList.contains( 'menuMobile' ) ) return
        setTimeout( e => {
            this.node.classList.remove( 'active' )
            document.body.classList.remove( 'menuMobile' )
        }, 300 )
        
    }

    mouseEnter( e ){
        if( document.body.classList.contains( 'menuMobile' ) ) return
        document.body.classList.remove( 'menuDown' )
        this.hoverActive = true
        
        if( this.mouseOutTimer ) {
            clearTimeout( this.mouseOutTimer )
            this.mouseOutTimer = null
        }
        this.lines = []
        // this.node.className = e.target.dataset.item
        this.node.style.color = e.target.dataset.color
        this.node.style.background = e.target.dataset.bg
        
        this.inner.innerHTML = ''
        var line = document.createElement( 'div' )
        line.classList.add( 'line' )
        var lineBuffer = 4
        for( var i = 0 ; i < 18 ; i++ ) line.innerHTML += '<span>' + e.target.innerHTML + ' </span>'
        
        while( this.inner.offsetHeight < ( this.pattern.offsetHeight ) ) this.inner.appendChild( line.cloneNode(true) )
        for( var i = 0 ; i < lineBuffer ; i++ ) this.inner.appendChild( line.cloneNode(true) )

        Array.from( this.inner.childNodes ).forEach( ( e, id ) => {
            e.style['margin-left'] = -500 - Math.random() * 200 + 'px'
            this.lines.push({
                el : e,
                p : 0,
                s : ( ( id % 2 == 0 ) ? 1 : -1 ) * ( 0.4 + Math.random( ) * 0.6 ),
                w : e.childNodes[ 0 ].offsetWidth
            })
        });

        var lineHeightOffset = this.inner.childNodes[0].offsetHeight * lineBuffer * 0.5
        this.inner.style.transform = 'translate3d( -100px, -' + lineHeightOffset + 'px, 0px )'
    }

    mouseLeave( e ){
        if( document.body.classList.contains( 'menuMobile' ) ) return
        if( !this.mouseOutTimer ) this.mouseOutTimer = setTimeout( this.mouseOut.bind( this ), 100 )
    }

    mouseOut( ){
        this.hoverActive = false
        this.inner.innerHTML = ''
        this.node.className = ''
        this.node.style.background = 'none'
        document.body.classList.remove( 'menuDown' )
    }

    animateLines( ){
        this.lines.forEach( l => {
            l.p += l.s * this.moveSpeed
            if( Math.abs( l.p ) >= l.w ) l.p = 0
            l.el.style.transform = 'translate3d( ' + l.p + 'px, 0px, 0px )'
        })
    }

	step( time ){
        this.hoverActive && this.animateLines( )
	}
}

export { Menu as default }