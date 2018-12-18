/* global THREE Physijs */

const GROUND_FRICTION = 3;
const GROUND_RESTITUTION = 0.4;

const ARENA_RADIUS = 200;
const WALL_SEGMENTS = 16;
const WALL_HEIGHT = 20;
const WALL_THICKNESS = 5;
const WALL_FRICTION = 1;
const WALL_RESTITUTION = 0.9;

class Arena {

  constructor(props) {
    this.$scene = props.$scene;
    this.createGround();
    this.createWall();
  }

  createGround() {
    const groundTextureMap = new THREE.TextureLoader().load('/assets/images/dirt3_pixelize10.jpg');
    groundTextureMap.wrapS = THREE.RepeatWrapping;
    groundTextureMap.wrapT = THREE.RepeatWrapping;
    groundTextureMap.repeat.set( 10, 10 );

    const material = Physijs.createMaterial(
      new THREE.MeshBasicMaterial({
        map: groundTextureMap
      }),
      GROUND_FRICTION,
      GROUND_RESTITUTION,
    );

    const size = 2 * ARENA_RADIUS + 5; //5 units of "padding"
    const $ground = new Physijs.BoxMesh(
      new THREE.BoxGeometry(size, 5, size),
      material,
      0 //Zero mass means immovable object
    );

    this.$scene.add( $ground );
  }

  createWall() {
    const wallTextureMap = new THREE.TextureLoader().load('/assets/images/concrete1.jpg');

    const material = Physijs.createMaterial(
      new THREE.MeshBasicMaterial({
        map: wallTextureMap,
      }),
      WALL_FRICTION,
      WALL_RESTITUTION
    );

    for ( let i = 0; i < WALL_SEGMENTS; i++ ) {
      const wallSegmentLength = 1 / WALL_SEGMENTS * 2 * Math.PI * ARENA_RADIUS + 0.1;
      const angle = 2 * Math.PI * i / WALL_SEGMENTS;

      const $wall = new Physijs.BoxMesh(
        new THREE.BoxGeometry(WALL_THICKNESS, WALL_HEIGHT, wallSegmentLength),
        material,
        0 //Zero mass means immovable object
      );

      $wall.position.set( ARENA_RADIUS * Math.cos( angle ), WALL_HEIGHT / 2, ARENA_RADIUS * Math.sin( angle ) );
      $wall.rotation.y = -angle;
      this.$scene.add($wall);
    }
  }
}

export default Arena;