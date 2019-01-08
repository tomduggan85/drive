/* global THREE Physijs */

const GROUND_FRICTION = 3;
const GROUND_RESTITUTION = 0.4;

const ARENA_RADIUS = 300;
const WALL_SEGMENTS = 100;
const WALL_HEIGHT = 12;
const WALL_THICKNESS = 5;
const WALL_FRICTION = 1;
const WALL_RESTITUTION = 0.9;

const ROOF_HEIGHT = 140;

class Arena {

  constructor(props) {
    this.$scene = props.$scene;
    this.createGround();
    this.createWall();
    this.createRail();
    this.createCrowd();
    this.createRoof();
  }

  createGround() {
    const groundTextureMap = new THREE.TextureLoader().load('/assets/images/dirt4.jpg');
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
    const wallTextureMap = new THREE.TextureLoader().load('/assets/images/concrete4.jpg');
    const collisionHeight = 30

    const material = Physijs.createMaterial(
      new THREE.MeshNormalMaterial(),
      WALL_FRICTION,
      WALL_RESTITUTION
    );
    material.visible = false;

    for ( let i = 0; i < WALL_SEGMENTS; i++ ) {
      const wallSegmentLength = 1 / WALL_SEGMENTS * 2 * Math.PI * ARENA_RADIUS + 0.1;
      const angle = 2 * Math.PI * i / WALL_SEGMENTS;

      const $wall = new Physijs.BoxMesh(
        new THREE.BoxGeometry(WALL_THICKNESS, collisionHeight, wallSegmentLength),
        material,
        0 //Zero mass means immovable object
      );

      $wall.position.set( ARENA_RADIUS * Math.cos( angle ), collisionHeight / 2, ARENA_RADIUS * Math.sin( angle ) );
      $wall.rotation.y = -angle;
      this.$scene.add($wall);
    }

    const concreteTextureMap = new THREE.TextureLoader().load('/assets/images/concrete4.jpg');
    concreteTextureMap.wrapS = THREE.RepeatWrapping;
    concreteTextureMap.wrapT = THREE.RepeatWrapping;
    concreteTextureMap.repeat.set( 20, 1 );

    const textureMaterial = new THREE.MeshBasicMaterial({
      map: concreteTextureMap,
      side: THREE.DoubleSide
    });
    
    const wallPoints = [
      new THREE.Vector2( ARENA_RADIUS - WALL_THICKNESS/2, 0 ),
      new THREE.Vector2( ARENA_RADIUS - WALL_THICKNESS/2, WALL_HEIGHT + 1 ),
      new THREE.Vector2( ARENA_RADIUS + WALL_THICKNESS/2, WALL_HEIGHT + 1 ),
      new THREE.Vector2( ARENA_RADIUS + WALL_THICKNESS/2, 0 ),
    ];

    const $wallVisuals = new THREE.Mesh(
      new THREE.LatheGeometry( wallPoints, WALL_SEGMENTS, Math.PI / WALL_SEGMENTS ),
      textureMaterial
    );

    this.$scene.add( $wallVisuals );
  }

  createCrowd() {
    const crowdSections = WALL_SEGMENTS;
    const crowdStartRadius = ARENA_RADIUS + 35;
    const crowdHeight = 20;
    const crowdEndRadius = crowdStartRadius + 220;
    const crowdEndHeight = 100;

    const crowdTextureMap = new THREE.TextureLoader().load('/assets/images/crowd/crowd2.jpg');
    crowdTextureMap.wrapS = THREE.RepeatWrapping;
    crowdTextureMap.wrapT = THREE.RepeatWrapping;
    crowdTextureMap.repeat.set( 40, 3 );

    const material = new THREE.MeshBasicMaterial({
      map: crowdTextureMap,
      side: THREE.DoubleSide
    });
    
    const crowdPoints = [
      new THREE.Vector2( crowdStartRadius, crowdHeight ),
      new THREE.Vector2( crowdEndRadius, crowdEndHeight ),
    ];

    const $crowd = new THREE.Mesh(
      new THREE.LatheGeometry( crowdPoints, crowdSections, Math.PI / WALL_SEGMENTS ),
      material
    );

    this.$scene.add( $crowd );

    const concreteTextureMap = new THREE.TextureLoader().load('/assets/images/concrete2.jpeg');
    concreteTextureMap.wrapS = THREE.RepeatWrapping;
    concreteTextureMap.wrapT = THREE.RepeatWrapping;
    concreteTextureMap.repeat.set( 20, 2 );

    const concreteMaterial = new THREE.MeshBasicMaterial({
      map: concreteTextureMap,
      side: THREE.DoubleSide
    });
    
    const concretePoints = [
      new THREE.Vector2( ARENA_RADIUS + 5, WALL_HEIGHT / 2 ),
      new THREE.Vector2( crowdStartRadius, WALL_HEIGHT / 2 ),
      new THREE.Vector2( crowdStartRadius, crowdHeight ),
    ];

    const $concrete = new THREE.Mesh(
      new THREE.LatheGeometry( concretePoints, crowdSections, Math.PI / WALL_SEGMENTS ),
      concreteMaterial
    );

    this.$scene.add( $concrete );

    const backConcretePoints = [
      new THREE.Vector2( crowdEndRadius, crowdEndHeight ),
      new THREE.Vector2( crowdEndRadius + 40, crowdEndHeight ),
      new THREE.Vector2( crowdEndRadius + 40, ROOF_HEIGHT ),
    ];

    const $backConcrete = new THREE.Mesh(
      new THREE.LatheGeometry( backConcretePoints, crowdSections, Math.PI / WALL_SEGMENTS ),
      concreteMaterial
    );

    this.$scene.add( $backConcrete );
  }

  createRail() {
    const texture = new THREE.TextureLoader().load('/assets/images/metal.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 20, 2 );

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide
    });

    const rails = [
      {height: 19, radius: 0.4},
      {height: 16, radius: 0.4},
    ];

    rails.forEach(({ height, radius }) => {
      const points = [
        new THREE.Vector2( ARENA_RADIUS, height - radius ),
        new THREE.Vector2( ARENA_RADIUS - radius, height ),
        new THREE.Vector2( ARENA_RADIUS, height + radius ),
        new THREE.Vector2( ARENA_RADIUS + radius, height ),
        new THREE.Vector2( ARENA_RADIUS, height - radius ),
      ];

      const $rail = new THREE.Mesh(
        new THREE.LatheGeometry( points, WALL_SEGMENTS, Math.PI / WALL_SEGMENTS ),
        material
      );

      this.$scene.add( $rail );
    })

    const struts = 32;
    const strutTexture = new THREE.TextureLoader().load('/assets/images/metal_r.jpg');

    const strutMaterial = new THREE.MeshBasicMaterial({
      map: strutTexture,
    });
    for ( let i = 0; i < struts; i++ ) {
      const $strut = new THREE.Mesh(
        new THREE.BoxGeometry( 0.6, 19, 0.6 ),
        strutMaterial
      );

      const angle = i / struts * 2 * Math.PI;
      $strut.position.set( ARENA_RADIUS * Math.cos( angle ), 10, ARENA_RADIUS * Math.sin( angle ) );
      $strut.rotation.y = -angle;

      this.$scene.add( $strut );
    }
  }

  createRoof() {
    const texture = new THREE.TextureLoader().load('/assets/images/roof2.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 40, 40 );
    const size = ARENA_RADIUS * 4;

    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });

    const $roof = new THREE.Mesh(
      new THREE.BoxGeometry( size, 2, size ),
      material
    );
    $roof.position.y = ROOF_HEIGHT;

    this.$scene.add( $roof );

    const beamTexture = new THREE.TextureLoader().load('/assets/images/roof1.jpg');
    beamTexture.wrapS = THREE.RepeatWrapping;
    beamTexture.wrapT = THREE.RepeatWrapping;
    beamTexture.repeat.set( 20, 20 );

    const beamMaterial = new THREE.MeshBasicMaterial({
      map: beamTexture,
    });

    const beams = 20;
    for ( let i = 0; i < beams; i++ ) {
      const beamDiameter = 1
      const beamHeight = 3
      const beamPos = -size/2 + i/beams * size
      const $topBeam = new THREE.Mesh(
        new THREE.BoxGeometry( size, beamHeight, beamDiameter ),
        beamMaterial
      );
      const $bottomBeam = new THREE.Mesh(
        new THREE.BoxGeometry( size, beamHeight, beamDiameter ),
        beamMaterial
      );

      $topBeam.position.set(0, ROOF_HEIGHT - beamHeight/2, beamPos)
      $bottomBeam.position.set(0, ROOF_HEIGHT - 18, beamPos)

      this.$scene.add( $topBeam );
      this.$scene.add( $bottomBeam );

      const struts = 30;
      for ( let j = 0; j < struts; j++ ) {
        
        const $strut = new THREE.Mesh(
          new THREE.BoxGeometry( 1, 18, 1 ),
          beamMaterial
        );
        
        $strut.position.set(-size/2 + j/struts * size, ROOF_HEIGHT - 9, beamPos)

        const $strut2 = new THREE.Mesh(
          new THREE.BoxGeometry( 1, 42, 1 ),
          beamMaterial
        );
        
        $strut2.position.set(-20 - size/2 + j/struts * size, ROOF_HEIGHT - 10, beamPos)
        $strut2.rotation.z = 1.25;
        
        this.$scene.add( $strut );
        this.$scene.add( $strut2 );
      }
    }
  }
}

export default Arena;