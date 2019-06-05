import { Object3D, MeshBasicMaterial, BoxGeometry, PlaneGeometry, Vector2, Vector3, Mesh, TextureLoader, MeshMatcapMaterial } from 'three'

import matCap from '../../assets/matcap-porcelain-white.jpg'

class Collider extends Mesh{
    constructor( d, p, r ){
        super()

        this.geometry = new PlaneGeometry( d.x, d.y )
        this.material = new MeshBasicMaterial( { transparent : true, opacity : 0, depthWrite: false, depthTest: false } )
        
        this.position.set( p.x, p.y, p.z )
        this.rotation.set( r.x, r.y, r.z )
        
        this.geometry.computeBoundingBox()
        this.updateMatrix();
        this.geometry.applyMatrix( this.matrix )
        this.position.set( 0, 0, 0 );
        this.rotation.set( 0, 0, 0 );
        this.scale.set( 1, 1, 1 );
        this.updateMatrix();

        this.userData = { 
            collider : true,
            snap : { x : 1, y : 1, z : 1 }
        }
    }
}

class Mbox extends Object3D {
    constructor( ){
        super()
        this.name = 'Mbox'
    }

    init(){
        this.children[0].material.color.setHex( 0x333333 )
    }

    createColliders(){
        let bb = this.children[0].geometry.boundingBox
        let dims = new Vector3( Math.round( bb.max.x - bb.min.x ), Math.round( bb.max.y - bb.min.y ), Math.round( bb.max.z - bb.min.z ) )
        
        // v back plane
        var plane = new Collider( new Vector2( dims.x, dims.y ), new Vector3( dims.x / 2, dims.y / 2, -dims.z ), new Vector3( 0, 0, 0 ) )
        this.children[1].add( plane )
        plane.userData.restrict = [ 'zbox', 'cover', 'shelf' ]

        // h bottom plane
        var plane = new Collider( new Vector2( dims.x, dims.z ), new Vector3( dims.x / 2, 0.01, -dims.z / 2 ), new Vector3( -Math.PI / 2, 0, 0 ) )
        this.children[1].add( plane )
        plane.userData.restrict = [ 'zbox', 'shelf' ]

        // h top plane
        var plane = new Collider( new Vector2( dims.x, dims.z ), new Vector3( dims.x / 2, dims.y + 0.01, -dims.z / 2 ), new Vector3( -Math.PI / 2, 0, 0 ) )
        this.children[1].add( plane )
        // plane.userData.restrict = [ 'pillow', 'shelf' ]

        // v side plane right
        var plane = new Collider( new Vector2( dims.y, dims.z ), new Vector3( dims.x + 0.01, dims.y / 2, -dims.z / 2 ), new Vector3( 0, -Math.PI / 2, -Math.PI / 2 ) )
        this.children[1].add( plane )
        plane.userData.restrict = [ 'zbox', 'side', 'shelf' ]

        // v side plane left
        var plane = new Collider( new Vector2( dims.y, dims.z ), new Vector3( 0.01, dims.y / 2, -dims.z / 2 ), new Vector3( 0, -Math.PI / 2, -Math.PI / 2 ) )
        this.children[1].add( plane )
        plane.userData.restrict = [ 'side' ]
        
    }
}

class Zbox extends Object3D {
    constructor( ){
        super()
        this.name = 'Zbox'
    }
}

class Cover extends Object3D {
    constructor( ){
        super()
        this.name = 'Cover'
    }
}

class Side extends Object3D {
    constructor( ){
        super()
        this.name = 'Side'
    }
}

class Shelf extends Object3D {
    constructor( ){
        super()
        this.name = 'Shelf'
    }
}

class Drawer extends Object3D {
    constructor( ){
        super()
        this.name = 'Drawer'
    }
}

class Pillow extends Object3D {
    constructor( ){
        super()
        this.name = 'Pillow'
    }

    init( ){
        this.children[0].material.color.setHex( 0x666666 )
    }
}

class Base extends Object3D {
    constructor( ){
        super()
        this.name = 'Base'
    }

    init(){
        this.children[0].material.color.setHex( 0x333333 )
    }

    createColliders(){
        let bb = this.children[0].geometry.boundingBox
        let dims = new Vector3( Math.round( bb.max.x - bb.min.x ), bb.max.y - bb.min.y, Math.round( bb.max.z - bb.min.z ) )
        console.log( dims )
        // h top plane
        var plane = new Collider( new Vector2( dims.x, dims.z ), new Vector3( dims.x / 2, dims.y, -dims.z / 2 ), new Vector3( -Math.PI / 2, 0, 0 ) )
        this.children[1].add( plane )
        plane.userData.snap = { x : 1, y : 0, z : 1 }
    }
}

class Item {
    constructor( type, mesh ){
        this.type = type
        switch ( type ) {
            case 'mbox':
                this.obj = new Mbox( )
                break
            case 'zbox':
                this.obj = new Zbox( )
                break
            case 'base':
                this.obj = new Base( )
                break
            case 'cover':
                this.obj = new Cover( )
                break
            case 'side':
                this.obj = new Side( )
                break
            case 'shelf':
                this.obj = new Shelf( )
                break
            case 'drawer':
                this.obj = new Drawer( )
                break
            case 'pillow':
                this.obj = new Pillow( )
                break
            default : console.log('No module type found')
        }

        this.obj.add( mesh )
        mesh.position.set( 0, 0, 0 )

        let texLoader = new TextureLoader( )
        let tex = texLoader.load( matCap )
        
        mesh.material = new MeshMatcapMaterial( {
            color: 0xb36f00,
            matcap: tex
        } );

        mesh.userData = {
            type : 'item'
        }

        this.id = mesh.uuid

        mesh.geometry.computeBoundingBox()

        this.obj.init && this.obj.init()
    }

    place( ){
        this.colliders = new Object3D()
        this.obj.add( this.colliders )
        this.obj.createColliders && this.obj.createColliders()
        
    }

    step( time ){

    }
}

export { Item as default }