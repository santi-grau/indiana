import EventEmitter from 'event-emitter-es6'


class Formbox{
	constructor(){
        this.node = document.getElementById('formbox')
        this.bg = document.getElementById('overBackground')
        this.bg.addEventListener( 'mousedown', () => this.toggle() )

        this.checks = this.node.getElementsByClassName( 'check' )

        this.sendBut = document.getElementById('sendbut')
        this.sendBut.addEventListener( 'mousedown', () => this.sendForm() )
        for (var i = 0; i < this.checks.length; i++) {
            this.checks[ i ].addEventListener( 'mousedown', ( e ) => this.checkToggle( e ) )
        }

        this.emitter = new EventEmitter()
    }

    toggle(){
        this.node.classList.toggle('active')
    }

    checkToggle( e ){
        e.target.classList.toggle('active')
        if( this.checks[ 0 ].classList.contains( 'active' ) ) this.sendBut.classList.add( 'active' )
        else this.sendBut.classList.remove( 'active' )
    }

    sendForm(){
        this.emitter.emit( 'send' )
    }

    validateEmail( mail ) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test( mail ) ) return (true)
        alert("You have entered an invalid email address!")
        return (false)
    }
}

export { Formbox as default }