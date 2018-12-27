/* global THREE Physijs */

import { VEHICLE_DEFS } from '../shared/Vehicles';

class StaticVehicleScene {
  
  constructor( props ) {
    this.$scene = new THREE.Scene();
    this.loader = new THREE.GLTFLoader(); 

    this.vehicleDef = VEHICLE_DEFS[ props.vehicleType ];

    this.createLights();
    this.createVehicle();

    this.step();
  }

  createVehicle() {
    this.$vehicle = new THREE.Group();
    this.$scene.add( this.$vehicle );

    const { chassisAsset: { uri: chassisUri }, wheelAsset: { uri: wheelUri } } = this.vehicleDef;  

    this.loader.load(
      chassisUri,
      this.onChassisLoaded,
      undefined, //onProgress
      ( error ) => {
        console.error( error, `Error loading static chassis asset: ${ chassisUri }` );
      }
    );

    for ( let i = 0; i < 4; i++ ) {
      this.loader.load(
        wheelUri,
        this.onWheelLoaded.bind( this, i ),
        undefined, //onProgress
        ( error ) => {
          console.error( error, `Error loading static wheel asset: ${ wheelUri }` );
        }
      );
    }
  }

  onChassisLoaded = ( loadedObject ) => {
    const { scene: asset } = loadedObject;
    const { chassisAsset: { scale, rotation, position } } = this.vehicleDef;

    asset.scale.set(scale, scale, scale)
    asset.position.set( -2.8, 0, -1.2 );
    asset.rotation.set( rotation.x, rotation.y, rotation.z );
    this.$vehicle.add( asset );

  }

  onWheelLoaded = ( wheelIndex, loadedObject ) => {
    const { scene: asset } = loadedObject;
    const { wheelAsset: { scale, rotation } } = this.vehicleDef;

    console.error( scale, rotation )
    const x = -this.vehicleDef.wheelBase / 2 * (wheelIndex < 2 ? 1 : -1);
    const y = 1.8;
    const z = -this.vehicleDef.trackWidth / 2 * (wheelIndex % 2 ? 1 : -1);

    asset.scale.set(scale, scale, scale)
    asset.position.set( x, y, z );
    asset.rotation.set( Math.PI / 2, 0, 0 );
    this.$vehicle.add( asset );
  }

  createLights() {    
    this.$scene.add( new THREE.AmbientLight( 0x404040, 17 ));
  }

  step = () => {
    requestAnimationFrame( this.step );
    const tx = Date.now() / 2000;
    const ty = Date.now() / 3000;

    const rx = Math.sin(tx) * 0.2;
    const ry = Math.sin(ty) * 1.5;
    

    if ( this.$vehicle ) {
      this.$vehicle.rotation.x = rx;
      this.$vehicle.rotation.y = ry;
    }
  }
}

export default StaticVehicleScene;