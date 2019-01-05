/* global THREE Physijs */

import { VEHICLE_DEFS } from '../shared/Vehicles';

export const ANIMATION_TYPES = {
  SPLASH_SPIN: 'SPLASH_SPIN',
  CONTINUOUS_SPIN: 'CONTINUOUS_SPIN',
  STATIC_SCREENSHOT: 'STATIC_SCREENSHOT',
};

const VEHICLE_DISPLAY_HEIGHT = 1.8;

class StaticVehicleScene {
  
  constructor( props ) {
    this.$scene = new THREE.Scene();
    this.loader = new THREE.GLTFLoader(); 

    this.vehicleDef = VEHICLE_DEFS[ props.vehicleType ];
    this.animationType = props.animationType;
    
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

    this.vehicleDef.wheels.map( function( wheelDef ) {

      this.loader.load(
        wheelUri,
        this.onWheelLoaded.bind( this, wheelDef ),
        undefined, //onProgress
        ( error ) => {
          console.error( error, `Error loading static wheel asset: ${ wheelUri }` );
        }
      );
    
    }.bind(this) )
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

  onWheelLoaded = ( wheelDef, loadedObject ) => {
    const { scene: asset } = loadedObject;
    const { wheelAsset: { scale, rotation, flip } } = this.vehicleDef;
    const { x, z } = wheelDef

    const y = 0;

    asset.scale.set(scale, scale, scale)
    if ( z < 0 ) {
      asset.scale[ flip ] *= -1;
    }
    asset.position.set( x, y, z );
    asset.rotation.set( Math.PI / 2 - rotation.x, rotation.y, rotation.z );
    this.$vehicle.add( asset );
  }

  createLights() {    
    this.$scene.add( new THREE.AmbientLight( 0x404040, 17 ));
  }

  stepSplashSpin() {
    //Gentle partial spin, for splash page
    const tx = Date.now() / 2000;
    const ty = Date.now() / 3000;

    const rx = Math.sin(tx) * 0.2;
    const ry = Math.sin(ty) * 0.7;
    
    this.$vehicle.rotation.x = rx;
    this.$vehicle.rotation.y = ry;
  }

  stepContinuousSpin() {
    const ty = Date.now() / 1000;
    this.$vehicle.rotation.y = -ty;
  }

  setupStaticScreenshot() {
   this.$vehicle.rotation.y = 1.25; 
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

        case ANIMATION_TYPES.STATIC_SCREENSHOT:
          this.setupStaticScreenshot();
          break;

        default:
          break;
      }
      
    }
  }
}

export default StaticVehicleScene;