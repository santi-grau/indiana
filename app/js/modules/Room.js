import { Object3D, MeshBasicMaterial, TextureLoader, Vector2, RepeatWrapping } from 'three'
import aoMap from '../../assets/roomAO.jpg'
import gridMap from '../../assets/gridAlpha.png'

class Room extends Object3D{
    constructor( mesh ){
        super()
        
        this.texLoader = new TextureLoader( )
        this.ao = this.texLoader.load( aoMap )
        this.ao.flipY = false

        this.mesh = mesh
        this.add( this.mesh )

        this.grid = new Object3D()
        this.add( this.grid )

        this.mesh.children.forEach( (geo, i) => {
            geo.geometry.computeBoundingBox()

            var clone = geo.clone()

            this.gridTex = this.texLoader.load( gridMap )
            this.gridTex.wrapS = RepeatWrapping
            this.gridTex.wrapT = RepeatWrapping

            if( geo.name == 'floor' ) {
                geo.userData = {  collider : true, snap : { x : 1, y : 0, z : 1 } }
                var material = new MeshBasicMaterial( { color : 0xdedede, aoMap : this.ao, aoMapIntensity : 0.4 } )
                this.gridTex.repeat = new Vector2( 20, 20 )
                var gridMat = new MeshBasicMaterial( { color : 0x000000, map : this.gridTex, transparent : true, opacity : 0 } )
                clone.material = gridMat
                clone.position.y = 0.005
                geo.geometry.computeBoundingBox()
            }
            if( geo.name == 'w1' ) {
                geo.userData = {  collider : true, snap : { x : 1, y : 1, z : 1 } }
                var material = new MeshBasicMaterial( { color : 0xededed, aoMap : this.ao, aoMapIntensity : 0.4 } )
                this.gridTex.repeat = new Vector2( 8, 20 )
                var gridMat = new MeshBasicMaterial( { color : 0x000000, map : this.gridTex, transparent : true, opacity : 0 } )
                clone.material = gridMat
                clone.position.z = -9.995
                geo.geometry.computeBoundingBox()
            }
            if( geo.name == 'w2' ) {
                geo.userData = {  collider : true, snap : { x : 1, y : 1, z : 1 } }
                var material = new MeshBasicMaterial( { color : 0xffffff, aoMap : this.ao, aoMapIntensity : 0.4 } )
                this.gridTex.repeat = new Vector2( 8, 20 )
                var gridMat = new MeshBasicMaterial( { color : 0x000000, map : this.gridTex, transparent : true, opacity : 0 } )
                clone.material = gridMat
                clone.position.x = 9.995
                geo.geometry.computeBoundingBox()
            }

            this.grid.add( clone )
            
            geo.receiveShadow = true
            geo.material = material
        })
    }

    showGrid( ){
        this.gridActive = true
    }

    resetGrid( ){
        this.gridActive = false
    }

    step( time ){
        if( this.gridActive ){
            this.grid.children.forEach( (geo, i) => {
                geo.material.opacity += ( 1 - geo.material.opacity ) * 0.1
            })
        } else {
            this.grid.children.forEach( (geo, i) => {
                geo.material.opacity -= geo.material.opacity * 0.1
            })
        }
    }
}

export { Room as default }