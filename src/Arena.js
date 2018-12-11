/* global THREE Physijs */

const DEFAULT_FRICTION = 3;
const DEFAULT_RESTITUTION = 0.4;

const ARENA_RADIUS = 200;
const WALL_SEGMENTS = 16;
const WALL_HEIGHT = 20;

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
      new THREE.BoxGeometry(2000, 5, 2000),
      material,
      0
    );

    scene.add( $ground );

    this.createWall( scene );
  }

  createWall( scene ) {
    const material = Physijs.createMaterial(
      new THREE.MeshNormalMaterial(),
      1, //friction
      0.9 //restitution
    );

    for ( let i = 0; i < WALL_SEGMENTS; i++ ) {
      const wallSegmentLength = 1 / WALL_SEGMENTS * 2 * Math.PI * ARENA_RADIUS;
      const angle = 2 * Math.PI * i / WALL_SEGMENTS;

      const $wall = new Physijs.BoxMesh(
        new THREE.BoxGeometry(5, WALL_HEIGHT, wallSegmentLength),
        material,
        0
      );

      $wall.position.set( ARENA_RADIUS * Math.cos( angle ), WALL_HEIGHT / 2, ARENA_RADIUS * Math.sin( angle ) );
      $wall.rotation.y = -angle;
      scene.add($wall);
    }
  }
}

export default Arena;