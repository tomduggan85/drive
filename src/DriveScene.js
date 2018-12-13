/* global THREE Physijs */

import Vehicle from './Vehicle';
import Arena from './Arena';

class DriveScene {
  
  constructor() {

    Physijs.scripts.worker = '/js/physijs_worker.js';
    Physijs.scripts.ammo = '/js/ammo.js';

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
        keys: {
          left: 37,
          right: 39,
          forward: 38,
          reverse: 40,
        }
      }),
      new Vehicle({
        scene: this.$scene,
        keys: {
          left: 65,
          right: 68,
          forward: 87,
          reverse: 83,
        }
      })
    ];

    this.step();
  }

  step = () => {
    requestAnimationFrame( this.step );
    this.$scene.simulate();
  }
}

export default DriveScene;