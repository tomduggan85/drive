/* global THREE Physijs */

import Vehicle from './Vehicle';
import Arena from './Arena';

class DriveScene {
  
  constructor( props ) {

    Physijs.scripts.worker = '/external_js/physijs_worker.js';
    Physijs.scripts.ammo = '/external_js/ammo.js';

    this.socket = props.socket;

    this.$scene = new Physijs.Scene();
    this.$scene.setGravity(new THREE.Vector3( 0, -50, 0 ));
    this.$scene.add( new THREE.AmbientLight( 0x404040, 15 ));
    
    const pointLight = new THREE.PointLight( 0x404040, 10 );
    pointLight.position.set(20, 20, 0);
    this.$scene.add( pointLight );

    const arena = new Arena({
      scene: this.$scene,
    })

    this.cars = [
      new Vehicle({
        scene: this.$scene,
        vehicleType: 'lada',
        position: {x: 40, y: 8, z: 0},
        rotation: {x: 0, y: 0, z: 0},
        keys: {
          left: 65,
          right: 68,
          forward: 87,
          reverse: 83,
        }
      }),
      new Vehicle({
        scene: this.$scene,
        vehicleType: 'pontiac',
        position: {x: -40, y: 8, z: 0},
        rotation: {x: 0, y: Math.PI, z: 0},
        keys: {
          left: 37,
          right: 39,
          forward: 38,
          reverse: 40,
        }
      })
    ];


    this.socket.addEventListener('message', function( message ) {
      const { playerId, action } = JSON.parse(message.data);
      const VALID_ACTIONS = [
        'onLeft', 
        'onRight', 
        'offSteer', 
        'onForward', 
        'onReverse',
        'offGas',
      ];
      if ( VALID_ACTIONS.includes( action ))
      this.cars[ playerId ][ action ]();
    }.bind( this ));

    this.step();
  }

  step = () => {
    requestAnimationFrame( this.step );
    this.$scene.simulate();
  }
}

export default DriveScene;