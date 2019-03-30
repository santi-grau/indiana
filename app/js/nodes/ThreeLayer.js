import {  Vector2, WebGLRenderer, Scene, OrthographicCamera, Object3D, Texture, sRGBEncoding, MeshMatcapMaterial,MeshBasicMaterial, ShaderMaterial, MeshStandardMaterial, CubeTextureLoader, TextureLoader } from 'three'

import cubemap from '../../assets/cubemap/*.jpg'

import GLTFLoader from 'three-gltf-loader'
import model from '../../assets/ani/ani.gltf'
import normals from '../../assets/ani/png/*.png'
import texs from '../../assets/ani/jpg/*.jpg'
import lms from '../../assets/lightmaps/*.jpg'
import shadows from '../../assets/shadow/*.png'

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
        this.inner.position.set( 0, -2, 0 )
        this.orbitGroup.add( this.inner )
        

        const gltfLoader = new GLTFLoader( )
        const texLoader = new TextureLoader( )

        var maps = { c1Bake : 'Mbox1', c2Bake : 'Mbox2', c3Bake : 'Mbox4', dBake : 'Mbox3' }
        
        this.lightmaps = []
        this.shadowmaps = []
        Object.values( lms ).forEach( lm => {
            var lmt = texLoader.load( lm )
            lmt.flipY = false
            this.lightmaps.push( lmt ) 
        })

        Object.values( shadows ).forEach( sd => {
            var sdt = texLoader.load( sd )
            sdt.flipY = false
            this.shadowmaps.push( sdt ) 
        })
        
        var loader = new CubeTextureLoader();
        var textureCube = loader.load( [ cubemap.px, cubemap.nx, cubemap.py, cubemap.ny, cubemap.pz, cubemap.nz ] );

        gltfLoader.load(
            model,
            ( gltf ) => {
                
                gltf.scene.children.forEach( child => {
                    var c = child.clone()
                    if( c.name !== 'Plane'){
                        var key = 'b2'
                        
                        if( maps[c.name] ) key = maps[c.name]  
    
                        var n = texLoader.load( normals[ key + '_normal'])
                        n.flipY = false
    
                        var m = texLoader.load( texs[ key + '_baseColor'])
                        m.flipY = false
                        
                        var orm = texLoader.load( texs[ key + '_ORM'])
                        orm.flipY = false
    
                        c.material = new MeshStandardMaterial({
                            envMap : textureCube,
                            envMapIntensity : 1,
                            map : m,
                            aoMap : orm,
                            aoMapIntensity : 0.5,
                            roughnessMap : orm,
                            normalMap : n,
                            normalScale : new Vector2(2,2),
                            lightMap : this.lightmaps[10],
                            lightMapIntensity : 1,
                            // metalness : 0x000000,
                            metalnessMap : orm
                        })
                    } else {
                        
                        var s = texLoader.load( shadows[17] )
                        s.flipY = false
                        this.plane = c
                        c.material = new ShaderMaterial( {
                            uniforms: {
                                tex: { value: s }
                            },
                            vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
                            fragmentShader: 'uniform sampler2D tex; varying vec2 vUv; void main() { vec2 uv = vUv; vec4 c = texture2D(tex, uv); uv *=  1.0 - uv.yx; float vig = uv.x*uv.y * 15.0; vig = pow(vig, 2.0); gl_FragColor = vec4( 0.0, 0.0, 0.0, c * vig  ); }'
                        } );
                    }
                    this.inner.add( c )
                } )
            }
        )
    }

    updateBlocks( p ){
        var ani = ['b0','b1','b2','b3','B4','B5','B6','B7','B8','B9','B10','B11','B12','B13','c1Bake','c2Bake','c3Bake', 'dBake']
        
        let blocks = this.inner.children

        let aniIndex = Math.floor( ( 1 - Math.abs( Math.pow( p * 2, 3 ) ) ) * ani.length )
        
        for( var i = 0 ; i < aniIndex + 1 ; i++ ){
            blocks.forEach( ( block, id ) => {
                if( block.name == ani[ i ] ) {
                    block.visible = true
                    block.material.lightMap = this.lightmaps[aniIndex]
                }
            })
        }

        for( var i = aniIndex + 1; i < ani.length ; i++ ){
            blocks.forEach( ( block, id ) => {
                if( block.name == ani[ i ] ) {
                    block.visible = false
                    block.material.lightMap = this.lightmaps[aniIndex]
                }
            })
        }

        this.plane.material.uniforms.tex.value = this.shadowmaps[aniIndex]

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

        this.orbitGroup.rotation.y += ( ( -Math.PI / 3 * this.mouse.x ) - this.orbitGroup.rotation.y ) * 0.1
        this.orbitGroup.rotation.x += ( ( -Math.PI / 3 * this.mouse.y ) - this.orbitGroup.rotation.x ) * 0.1
	}
}

export { ThreeLayer as default }