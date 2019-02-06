import Modal from './Modal'

class Footer {
	constructor( node ){
        this.node = node

        Array.from( this.node.getElementsByClassName( 'info' ) ).forEach( e => {
            e.addEventListener( 'click', this.openModal.bind( this ) )
        });
    }
    
    openModal( e ){
        this.modal = new Modal( document.getElementById('modal'), e.target.dataset.target )
    }
}

export { Footer as default }