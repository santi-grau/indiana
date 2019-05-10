import {  Vector2, Vector3, WebGLRenderer, Scene, OrthographicCamera, Raycaster, AxesHelper, Object3D, DirectionalLight, PCFSoftShadowMap } from 'three'

import Item from './modules/Item'
import Room from './modules/Room'

import model from '../assets/modules.gltf'
import GLTFLoader from 'three-gltf-loader'

class Simulator{
	constructor(){
        this.node = document.getElementById('threeLayer')
		this.modules = {}
		this.mouse = new Vector2( 0, 0 )
        this.renderer = new WebGLRenderer( { alpha : true, antialias : true } )
		this.node.appendChild( this.renderer.domElement )
		this.raycaster = new Raycaster()
		
		this.items = []
		this.itemList = document.getElementById('items')
		this.active = null

		var titles = document.getElementsByClassName('title')
		for (let title of titles) title.addEventListener('click', this.toggleSection.bind( this ) )

        this.scene = new Scene()
		this.camera = new OrthographicCamera()
		// this.scene.add( new AxesHelper(10))

		this.orbitGroup = new Object3D()
		this.scene.add( this.orbitGroup )

		this.root = new Object3D()
		this.orbitGroup.add( this.root )
		
		var mods = document.getElementsByClassName('mod')
		for (let mod of mods) mod.addEventListener('click', this.addModule.bind( this ) )

		new GLTFLoader().load( model, this.modulesLoaded.bind( this ) )
        
		window.addEventListener( 'mousemove', this.mouseMove.bind( this ), false )
		window.addEventListener( 'mousedown', this.mouseDown.bind( this ), false )

		this.resize()
		this.step()
	}

	toggleSection( e ){
		var blocks = document.getElementsByClassName('block')
		for (let block of blocks) block.classList.remove('active')
		e.currentTarget.parentNode.classList.add('active')
	}

	modulesLoaded( e ){
		e.scene.children.forEach( module => this.modules[ module.name ] = module )
		this.room = new Room( this.modules.room )
		this.root.add( this.room )
	}

	addModule( e ){
		this.room.showGrid()
		var mod = this.modules[ e.target.dataset.mod ].clone()
		var item = new Item( e.target.dataset.type, mod )
		this.root.add( item.obj )
		this.active = item
		this.placing = true
		item.obj.visible = false
	}

	

	refreshItemList(){
		if( this.items.length ) this.itemList.classList.add( 'active' )
		else this.itemList.classList.remove( 'active' )

		var items = this.itemList.getElementsByClassName( 'item' )
		for ( var i = items.length - 1 ; i >= 0 ; i-- ) items[i].parentNode.removeChild( items[i] )

		this.items.forEach( item => {
			var div = document.createElement( 'div' )
			div.classList.add( 'item' )
			div.innerHTML = item.obj.name
			this.itemList.appendChild( div )
		})
	}

	getIntersects( x, y ){
		this.raycaster.setFromCamera( new Vector2( x, y ), this.camera )
		return this.raycaster.intersectObjects( this.scene.children, true )
	}

	mouseMove( e ){
		this.mouse = new Vector2( e.clientX / this.node.offsetWidth - 0.5, e.clientY / this.node.offsetHeight - 0.5 )
		var intersects = this.getIntersects( ( ( e.offsetX ) / this.node.offsetWidth ) * 2 - 1, - ( e.offsetY / this.node.offsetHeight ) * 2 + 1 )
		
		var colliders = []
		if( intersects.length ) {
			intersects.forEach( i => {
				if( i.object.userData.collider ) {
					if( !i.object.userData.restrict ) {
						colliders.push( i )
					} else {
						i.object.userData.restrict.forEach( type => ( type == this.active.type) && colliders.push( i ) )
					}
				}
			})
		} else {
			if( this.active ) this.active.obj.visible = false
		}

		if( this.placing && this.active && colliders.length ){
			this.active.obj.visible = true
			let obj = colliders[0].object
			let p = colliders[0].point
			let n = colliders[0].face.normal
			
			let bb = this.active.obj.children[0].geometry.boundingBox
			let dims = new Vector3( Math.round( bb.max.x - bb.min.x ), Math.round( bb.max.y - bb.min.y ), Math.round( bb.max.z - bb.min.z ) )	
			let cbb = obj.geometry.boundingBox
			let cdims = new Vector3( Math.round( cbb.max.x - cbb.min.x ), Math.round( cbb.max.y - cbb.min.y ), Math.round( cbb.max.z - cbb.min.z ) )	
			
			this.scene.updateMatrixWorld()
			var gPos = new Vector3().setFromMatrixPosition( colliders[0].object.matrixWorld )
			
			var maxx = Math.round( gPos.x + obj.geometry.boundingBox.max.x - dims.x )
			var maxy = Math.round( gPos.y + obj.geometry.boundingBox.max.y - dims.y )
			var maxz = Math.round( gPos.z + obj.geometry.boundingBox.min.z + dims.z )
			
			let position = new Vector3( Math.min( maxx, p.x ),  Math.min( maxy, p.y ) + dims.y * Math.round( n.y ), Math.max( maxz, p.z ) )
			
			if( obj.userData.snap && obj.userData.snap.x ) position.x = Math.floor( position.x ) + Math.floor( ( position.x - Math.floor( position.x ) ) * obj.userData.snap.x ) / obj.userData.snap.x
			if( obj.userData.snap && obj.userData.snap.y ) position.y = Math.floor( position.y ) + Math.floor( ( position.y - Math.floor( position.y ) ) * obj.userData.snap.y ) / obj.userData.snap.y
			if( obj.userData.snap && obj.userData.snap.z ) position.z = Math.floor( position.z ) + Math.ceil( ( position.z - Math.floor( position.z ) ) * obj.userData.snap.z ) / obj.userData.snap.z
			
			// if( dims.x > cdims.x ) position.x = Math.round( gPos.x + obj.geometry.boundingBox.min.x )
			// if( dims.y > cdims.?y ) position.y = Math.round( gPos.y + obj.geometry.boundingBox.min.y )
			// if( dims.z > cdims.z ) position.z = Math.round( gPos.z + obj.geometry.boundingBox.min.z )
			// console.log( position )
			this.active.obj.position.copy( position )
		}
	}

	mouseDown( e ){
		if( !this.placing ) return
		var intersects = this.getIntersects( ( ( e.offsetX ) / this.node.offsetWidth ) * 2 - 1, - ( e.offsetY / this.node.offsetHeight ) * 2 + 1 )
		if( intersects.length ) {
			this.items.push( this.active )
			this.active.place()
			this.refreshItemList()
		}
		this.placing = false
		this.active = null
		this.room.resetGrid()
	}

	resize( ){
        let [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
		this.renderer.setSize( width, height )
		this.renderer.setPixelRatio( 2 )
        var camView = { left :  width / -2, right : width / 2, top : height / 2 + 3, bottom : height / -2 + 3 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 1000
		
		this.camera.zoom = 40
		this.camera.position.set( -20, 12, 20 )
		this.camera.lookAt( new Vector3( 0, 0, 0 ) )
		this.camera.updateProjectionMatrix( )
	}

	step( time ){
		window.requestAnimationFrame( this.step.bind( this ) )	
		this.room && this.room.step( time )	 
		this.renderer.render( this.scene, this.camera )

		this.orbitGroup.rotation.y += ( ( -Math.PI / 16 * this.mouse.x ) - this.orbitGroup.rotation.y ) * 0.05
        // this.orbitGroup.rotation.x += ( ( -Math.PI / 16 * this.mouse.y ) - this.orbitGroup.rotation.x ) * 0.05
	}
}

new Simulator()