/* global THREE Physijs */

import Vehicle from './Vehicle';
import Arena from './Arena';

class DriveScene {
  
  constructor( props ) {

    Physijs.scripts.worker = '/js/physijs_worker.js';
    Physijs.scripts.ammo = '/js/ammo.js';

    this.socket = props.socket;

    this.$scene = new Physijs.Scene();
    this.$scene.setGravity(new THREE.Vector3( 0, -50, 0 ));
    this.$scene.add( new THREE.AmbientLight( 0x404040, 50 ));
    
    const pointLight = new THREE.PointLight( 0x404040, 20 );
    pointLight.position.set(20, 20, 0);
    this.$scene.add( pointLight );

    const arena = new Arena({
      scene: this.$scene,
    })

    this.cars = [
      new Vehicle({
        scene: this.$scene,
        position: {x: 40, y: 8, z: 0},
        rotation: {x: 0, y: 0, z: 0},
        keys: {
          left: 37,
          right: 39,
          forward: 38,
          reverse: 40,
        }
      }),
      new Vehicle({
        scene: this.$scene,
        position: {x: -40, y: 8, z: 0},
        rotation: {x: 0, y: Math.PI, z: 0},
        keys: {
          left: 65,
          right: 68,
          forward: 87,
          reverse: 83,
        }
      })
    ];


    this.socket.addEventListener('message', function( message ) {
      const payload = JSON.parse(message.data);
      this.cars[ payload.playerId ][payload.action](); //TODO whitelist fns
    }.bind( this ));

    this.step();
  }

  step = () => {
    requestAnimationFrame( this.step );
    this.$scene.simulate();
  }
}

export default DriveScene;