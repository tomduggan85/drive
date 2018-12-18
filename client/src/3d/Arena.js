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

    const groundTextureMap = new THREE.TextureLoader().load('/assets/images/dirt3_pixelize10.jpg');
    groundTextureMap.wrapS = THREE.RepeatWrapping;
    groundTextureMap.wrapT = THREE.RepeatWrapping;
    groundTextureMap.repeat.set( 10, 10 );

    const material = Physijs.createMaterial(
      new THREE.MeshBasicMaterial({
        map: groundTextureMap
      }),
      friction || DEFAULT_FRICTION,
      restitution || DEFAULT_RESTITUTION,
    );
    
    const $ground = new Physijs.BoxMesh(
      new THREE.BoxGeometry(2 * ARENA_RADIUS + 5, 5, 2 * ARENA_RADIUS + 5),
      material,
      0
    );

    scene.add( $ground );

    this.createWall( scene );
  }

  createWall( scene ) {
    const wallTextureMap = new THREE.TextureLoader().load('/assets/images/concrete1.jpg');
    wallTextureMap.wrapS = THREE.RepeatWrapping;
    wallTextureMap.wrapT = THREE.RepeatWrapping;
    wallTextureMap.repeat.set( 1, 1 );

    const material = Physijs.createMaterial(
      new THREE.MeshBasicMaterial({
        map: wallTextureMap,
      }),
      1, //friction
      0.9 //restitution
    );

    for ( let i = 0; i < WALL_SEGMENTS; i++ ) {
      const wallSegmentLength = 1 / WALL_SEGMENTS * 2 * Math.PI * ARENA_RADIUS + 0.1;
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