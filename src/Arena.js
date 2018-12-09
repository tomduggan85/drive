/* global THREE Physijs */

const DEFAULT_FRICTION = 3;
const DEFAULT_RESTITUTION = 0.4;

class Arena {

  constructor(props) {
    const {
      scene,
      friction,
      restitution,
    } = props;

    const material = Physijs.createMaterial(
      new THREE.MeshNormalMaterial(),
      friction || DEFAULT_FRICTION,
      restitution || DEFAULT_RESTITUTION,
    );
    
    const $ground = new Physijs.BoxMesh(
      new THREE.BoxGeometry(2000, 1, 2000),
      material,
      0
    );
    
    scene.add( $ground );
  }
}

export default Arena;