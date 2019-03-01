import {  Vector2, WebGLRenderer, Scene, OrthographicCamera, Object3D, Texture, sRGBEncoding, MeshMatcapMaterial, TextureLoader } from 'three'

import matCapMetal from '../../assets/matcapBlack.png'
import matCapWood from '../../assets/matcapWood.png'

import GLTFLoader from 'three-gltf-loader'
import model from '../../assets/model.gltf'

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

        this.inner = new Object3D()
        this.inner.position.set( -2, -2, 0 )
        this.orbitGroup.add( this.inner )
        

        const gltfLoader = new GLTFLoader( )
        const texLoader = new TextureLoader( )
        
        var matcapMetal = new Texture()
        matcapMetal.encoding = sRGBEncoding
        matcapMetal = texLoader.load( matCapMetal )
        var metal = new MeshMatcapMaterial( { matcap : matcapMetal } )

        var matcapWood = new Texture()
        matcapWood.encoding = sRGBEncoding
        matcapWood = texLoader.load( matCapWood )
        var wood = new MeshMatcapMaterial( { matcap : matcapWood } )
        
        
        
        gltfLoader.load(
            model,
            ( gltf ) => {
                var blocks = { }
                gltf.scene.children.forEach( child => blocks[ child.name ] = child )

                
                
                
                
                
                var b = blocks.b1.clone()
                b.position.set( 0, 0, 0 )
                b.material = metal
                this.inner.add( b )

                var b = blocks.b1.clone()
                b.position.set( 1, 0, 0 )
                b.material = metal
                this.inner.add( b )

                var b = blocks.b1.clone()
                b.position.set( 2, 0, 0 )
                b.material = metal
                this.inner.add( b )

                var b = blocks.c3.clone()
                b.position.set( 2, 0, 0 )
                b.material = wood
                this.inner.add( b )

                var b = blocks.d.clone()
                b.position.set( 2.075, 0.075, 0 )
                b.material = wood
                this.inner.add( b )

                var b = blocks.b1.clone()
                b.position.set( 3, 0, 0 )
                b.material = metal
                this.inner.add( b )

                var b = blocks.b10.clone()
                b.rotation.set( 0, 0, Math.PI / 2 )
                b.position.set( 1, 2, 0 )
                b.material = metal
                this.inner.add( b )

                var b = blocks.c2.clone()
                b.position.set( 1, 1, 0 )
                b.rotation.set( 0, 0, Math.PI / 2 )
                b.material = wood
                this.inner.add( b )

                var b = blocks.b1.clone()
                b.position.set( 1, 1, 0 )
                b.material = metal
                this.inner.add( b )

                var b = blocks.b1.clone()
                b.position.set( 2, 1, 0 )
                b.material = metal
                this.inner.add( b )

                var b = blocks.b1.clone()
                b.position.set( 3, 1, 0 )
                b.material = metal
                this.inner.add( b )

                var b = blocks.b1.clone()
                b.position.set( 1, 2, 0 )
                b.material = metal
                this.inner.add( b )

                var b = blocks.b10.clone()
                b.position.set( 3, 2, 0 )
                b.material = metal
                this.inner.add( b )

                var b = blocks.c2.clone()
                b.position.set( 2, 2, 0 )
                b.material = wood
                this.inner.add( b )

                var b = blocks.b1.clone()
                b.position.set( 0, 3, 0 )
                b.material = metal
                this.inner.add( b )

                var b = blocks.b1.clone()
                b.position.set( 1, 3, 0 )
                b.material = metal
                this.inner.add( b )

                var b = blocks.b1.clone()
                b.position.set( 2, 3, 0 )
                b.material = metal
                this.inner.add( b )

                var b = blocks.b1.clone()
                b.position.set( 3, 3, 0 )
                b.material = metal
                this.inner.add( b )

            }
        )
    }

    updateBlocks( p ){
        let blocks = this.inner.children
        let seq = Math.max( 0, Math.round( ( p * 1.2 + 0.5 ) * blocks.length ) )

        blocks.forEach( ( block, id ) => {
            block.visible = ( id <= seq )
        } )

    }

    mouseMove( e ){
        this.mouse = new Vector2( e.clientX / this.node.offsetWidth - 0.5, e.clientY / this.node.offsetHeight - 0.5 )
        this.updateBlocks( this.mouse.x )
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
        scale *= 60
        this.orbitGroup.scale.set( scale, scale, scale )
    }

	step( time ){
        this.renderer.render( this.scene, this.camera )

        this.orbitGroup.rotation.y += ( ( -Math.PI / 6 * this.mouse.x ) - this.orbitGroup.rotation.y ) * 0.1
        this.orbitGroup.rotation.x += ( ( Math.PI / 6 - Math.PI / 16 * this.mouse.y ) - this.orbitGroup.rotation.x ) * 0.1
	}
}

export { ThreeLayer as default }