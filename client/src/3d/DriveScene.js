/* global THREE Physijs */

import { Vehicle } from './Vehicle';
import Arena from './Arena';

const GRAVITY = -50;

class DriveScene {
  
  constructor( props ) {

    //TODO move this elsewhere so that it happens once per app session instead of once per scene
    Physijs.scripts.worker = '/external_js/physijs_worker.js';
    Physijs.scripts.ammo = '/external_js/ammo.js';

    this.socket = props.socket;

    this.$scene = new Physijs.Scene();
    this.$scene.setGravity(new THREE.Vector3( 0, GRAVITY, 0 ));
    
    const arena = new Arena({ $scene: this.$scene });
    this.createLights();
    this.createVehicles( props.vehicles );
    
    this.socket.addEventListener('message', this.onSocketMessage );
    this.step();
  }

  createVehicles( vehicles ) {
    //TODO create as many vehicles as props.vehicles passes in, instead of just two.
    this.vehicles = [
      new Vehicle({
        $scene: this.$scene,
        vehicleType: vehicles[0],
        position: {x: 40, y: 8, z: 0},
        rotation: {x: 0, y: 0, z: 0},
        /* WASD keys */
        keys: {
          left: 65,
          right: 68,
          forward: 87,
          reverse: 83,
        }
      }),
      new Vehicle({
        $scene: this.$scene,
        vehicleType: vehicles[1],
        position: {x: -40, y: 8, z: 0},
        rotation: {x: 0, y: Math.PI, z: 0},
        /* Arrow keys */
        keys: {
          left: 37,
          right: 39,
          forward: 38,
          reverse: 40,
        }
      })
    ];
  }

  createLights() {    
    this.$scene.add( new THREE.AmbientLight( 0x404040, 17 ));
  }

  onSocketMessage = ( message ) => {
    const { playerId, action } = JSON.parse(message.data);

    //action maps directly to a method on the vehicle object.
    const VALID_ACTIONS = [
      'onLeft', 
      'onRight', 
      'offSteer', 
      'onForward', 
      'onReverse',
      'offGas',
    ];

    if ( VALID_ACTIONS.includes( action )) {
      this.vehicles[ playerId ][ action ]();
    }
  }

  step = () => {
    requestAnimationFrame( this.step );
    this.$scene.simulate();
  }
}

export default DriveScene;