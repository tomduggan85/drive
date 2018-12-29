/* global THREE Physijs */

import { VEHICLE_DEFS } from '../shared/Vehicles';

export const ANIMATION_TYPES = {
  SPLASH_SPIN: 'SPLASH_SPIN',
  CONTINUOUS_SPIN: 'CONTINUOUS_SPIN'
};

const VEHICLE_DISPLAY_HEIGHT = 1.8;

class StaticVehicleScene {
  
  constructor( props ) {
    this.$scene = new THREE.Scene();
    this.loader = new THREE.GLTFLoader(); 

    this.vehicleDef = VEHICLE_DEFS[ props.vehicleType ];
    this.animationType = props.animationType;
    this.onLoad = props.onLoad;

    this.createLights();
    this.createVehicle();

    this.step();
  }

  createVehicle() {
    this.$vehicle = new THREE.Group();
    this.$vehicle.position.y = VEHICLE_DISPLAY_HEIGHT;
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
    const { chassisAsset: { scale, rotation, staticSceneOffset } } = this.vehicleDef;

    //TODO fix magic position values
    asset.scale.set(scale, scale, scale)
    asset.position.set( staticSceneOffset.x, staticSceneOffset.y, staticSceneOffset.z );
    asset.rotation.set( rotation.x, rotation.y, rotation.z );
    this.$vehicle.add( asset );
  }

  onWheelLoaded = ( wheelIndex, loadedObject ) => {
    const { scene: asset } = loadedObject;
    const { wheelAsset: { scale, rotation, flip } } = this.vehicleDef;

    const x = -this.vehicleDef.wheelBase / 2 * (wheelIndex < 2 ? 1 : -1);
    const y = 0;
    const z = -this.vehicleDef.trackWidth / 2 * (wheelIndex % 2 ? 1 : -1);

    asset.scale.set(scale, scale, scale)
    if ( wheelIndex % 2 === 0 ) {
      asset.scale[ flip ] *= -1;
    }
    asset.position.set( x, y, z );
    asset.rotation.set( Math.PI / 2 - rotation.x, rotation.y, rotation.z );//asset.rotation.set( Math.PI / 2, 0, 0 );
    this.$vehicle.add( asset );

    if ( wheelIndex === 3  && this.onLoad) {
      //Consider vehicle loaded once wheelIndex 3 is in the scene.
      this.onLoad();
    }
  }

  createLights() {    
    this.$scene.add( new THREE.AmbientLight( 0x404040, 17 ));
  }

  stepSplashSpin() {
    //Gentle partial spin, for splash page
    const tx = Date.now() / 2000;
    const ty = Date.now() / 3000;

    const rx = Math.sin(tx) * 0.2;
    const ry = Math.sin(ty) * 1.0;
    
    this.$vehicle.rotation.x = rx;
    this.$vehicle.rotation.y = ry;
  }

  stepContinuousSpin() {
    const ty = Date.now() / 1000;
    this.$vehicle.rotation.y = -ty;
  }

  step = () => {
    requestAnimationFrame( this.step );

    if ( this.$vehicle ) {

      switch ( this.animationType ) {
        case ANIMATION_TYPES.SPLASH_SPIN:
          this.stepSplashSpin();
          break;

        case ANIMATION_TYPES.CONTINUOUS_SPIN:
          this.stepContinuousSpin();
          break;

        default:
          break;
      }
      
    }
  }
}

export default StaticVehicleScene;