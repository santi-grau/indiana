import {  Vector2, WebGLRenderer, Scene, OrthographicCamera, Object3D, CubeTextureLoader, TextureLoader, MeshStandardMaterial, FileLoader, Group, BufferGeometry, BufferAttribute, MeshPhongMaterial, Mesh } from 'three'

import OBJLoader from 'three-obj-loader'
import mesh from '../../assets/home.obj'

import cubTex from '../../assets/cubemap/*.jpg'
import geoTex from '../../assets/textures/low/*.jpg'

class ThreeLayer {
	constructor( node ){
        this.node = node

        this.mouse = new Vector2( 0, 0 )
        this.refDimension = 375

        this.renderer = new WebGLRenderer( { alpha : true, antialias : true } )
        this.node.appendChild( this.renderer.domElement )
        
        this.scene = new Scene()
        this.camera = new OrthographicCamera()
        
        this.orbitGroup = new Object3D()
        this.scene.add( this.orbitGroup )
        
        this.cubeTexture = new CubeTextureLoader().load( [ cubTex.px, cubTex.nx, cubTex.py, cubTex.ny, cubTex.pz, cubTex.nz ] );
        
        let THREE = { FileLoader : FileLoader, Group : Group, BufferGeometry : BufferGeometry, BufferAttribute : BufferAttribute, MeshPhongMaterial : MeshPhongMaterial, Mesh : Mesh }
        OBJLoader(THREE)
        new THREE.OBJLoader().load( mesh, this.loaded.bind( this ) )
    }

    loaded( group ){
        var loader = new TextureLoader()
        group.children.forEach( mesh => { 
            let id = mesh.name.split( '.' )[ 0 ].split( '_' )[ 0 ]
            var material = new MeshStandardMaterial({
                map : loader.load( geoTex[ id + '_map' ] ),
                envMap : this.cubeTexture,
                envMapIntensity : 6,
                roughness : ( id == 'mbox' ) ? 0.6 : 0.8,
                metalness : ( id == 'mbox' ) ? 0.6 : 0.4
            })
            mesh.material = material
        } )
        group.scale.set( 0.1, 0.1, 0.1 )
        group.position.set( -187.5, -125, 0 )
        
        this.orbitGroup.add( group )
    }

    mouseMove( e ){
        this.mouse = new Vector2( e.clientX / this.node.offsetWidth - 0.5, e.clientY / this.node.offsetHeight - 0.5 )
    }

    resize( width, height ){
        this.renderer.setSize( width, height )
		this.renderer.setPixelRatio( 2 )
        var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 1000
        this.camera.updateProjectionMatrix( )
        
        var scale
        if( width < 768 ) scale = 1 + ( width / 768 - 1 ) * 0.5
        else scale = Math.min( 1.7, 1 + ( width / 768 - 1 ) )

        this.orbitGroup.scale.set( scale, scale, scale )
        this.orbitGroup.position.y = -height * 0.1
    }

	step( time ){
        this.renderer.render( this.scene, this.camera )

        this.orbitGroup.rotation.y += ( ( -Math.PI / 4 * this.mouse.x ) - this.orbitGroup.rotation.y ) * 0.1
        this.orbitGroup.rotation.x += ( ( Math.PI / 8 - Math.PI / 8 * this.mouse.y ) - this.orbitGroup.rotation.x ) * 0.1
	}
}

export { ThreeLayer as default }