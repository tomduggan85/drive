
/* global THREE Physijs */

const DEFAULT_TUNING = {
  wheelBase: 19,
  trackWidth: 11.5,
  maxVel: 200,
  torque: 3000,
  chassisMass: 5000,
  chassisShapes: [
    { offset: { x: -1, y: 8, z: 0 }, size: { x: 32, y: 4, z: 12} },
    { offset: { x: -5, y: 4, z: 0 }, size: { x: 18, y: 2, z: 10} },
    { offset: { x: -5, y: 5.5, z: 0 }, size: { x: 15, y: 1, z: 8.5} },
  ],
  wheelMass: 150,
  tireFriction: 3,
  steerAngle: Math.PI / 8,
}

class Vehicle {

  createChassis() {
    const { scene, tuning } = this;
    const chassisMaterial = Physijs.createMaterial(
      new THREE.MeshNormalMaterial(), 0.8, 0.8
    );
    chassisMaterial.visible = false;

    const volumes = tuning.chassisShapes.map( shape => shape.size.x * shape.size.y * shape.size.z )
    const totalVolume = volumes.reduce( ( accumulator, volume ) => accumulator + volume )

    //First shape is always the main chassis, additional shapes are added to it.
    const $chassis = new Physijs.BoxMesh(
      new THREE.BoxGeometry( tuning.chassisShapes[0].size.x, tuning.chassisShapes[0].size.y, tuning.chassisShapes[0].size.z ),
      chassisMaterial,
      tuning.chassisMass * volumes[0] / totalVolume
    );
    $chassis.position.set( tuning.chassisShapes[0].offset.x, tuning.chassisShapes[0].offset.y, tuning.chassisShapes[0].offset.z )
    
    for ( let i = 1; i < tuning.chassisShapes.length; i++ ) {
      const $shape = new Physijs.BoxMesh(
        new THREE.BoxGeometry( tuning.chassisShapes[i].size.x, tuning.chassisShapes[i].size.y, tuning.chassisShapes[i].size.z ),
        chassisMaterial,
        tuning.chassisMass * volumes[i] / totalVolume
      );
      $shape.position.set( tuning.chassisShapes[i].offset.x, tuning.chassisShapes[i].offset.y, tuning.chassisShapes[i].offset.z )

      $chassis.add($shape);
    }

    scene.add( $chassis );

    this.gltfLoader.load(
      '/assets/3d/stationwagon/scene.gltf',
      ( { scene: carAsset } ) => {
        carAsset.scale.set(7.5, 7.5, 7.5)
        carAsset.position.set(-1.9, -3.5, -1.2);
        carAsset.rotation.y = Math.PI / 2;
        $chassis.add( carAsset );
      },
      undefined,
      ( error ) => {
        console.error( error );
      }
    )

    this.$chassis = $chassis;
  }

  createWheel( isFront, isLeft ) {

    const z = this.tuning.trackWidth / 2 * (isLeft ? -1 : 1);
    const y = 6.5;
    const x = this.tuning.wheelBase / 2 * (isFront ? 1 : -1);

    if ( !this.wheelMaterial ) {
      this.wheelMaterial = Physijs.createMaterial(
        new THREE.MeshNormalMaterial(), this.tuning.tireFriction, 0.5
      );
    }
    
    if ( !this.wheelGeometry ) {
      this.wheelGeometry  = new THREE.CylinderGeometry( 1.9, 1.9, 1, 25 );
    }

    const $wheel = new Physijs.CylinderMesh( this.wheelGeometry, this.wheelMaterial, this.tuning.wheelMass );
    $wheel.rotation.x = Math.PI / 2;
    $wheel.position.set( x, y, z );
    
    this.scene.add( $wheel );
    const constraint = new Physijs.DOFConstraint(
      $wheel, this.$chassis, new THREE.Vector3( x, y, z )
    );
    this.scene.addConstraint( constraint, { disableCollision: true } );
    constraint.setAngularLowerLimit({ x: 0, y: 0, z: isFront ? 1 : 0 });
    constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 }); 
    
    return { $wheel, constraint }
  }
  
  constructor( props ) {
    this.gltfLoader = new THREE.GLTFLoader();

    this.scene = props.scene;
    this.tuning = { ...props.tuning, ...DEFAULT_TUNING };
    this.keys = props.keys;

    this.createChassis();

    this.wheels = {
      'F': {
        'L': this.createWheel(true, true),
        'R': this.createWheel(true, false),
      },
      'R': {
        'L': this.createWheel(false, true),
        'R': this.createWheel(false, false),
      }
    }

    
    
    this.$chassis.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z);
    this.$chassis.position.set(props.position.x, props.position.y, props.position.z);
    this.$chassis.__dirtyPosition = true;
    this.$chassis.__dirtyRotation = true;
    

    document.addEventListener( 'keydown', this.onKeyDown );
    document.addEventListener( 'keyup', this.onKeyUp );
  }

  onKeyDown = (e) => {
    switch( e.keyCode ) {
      case this.keys.left:
        this.onLeft();
        e.preventDefault();
        break;
      
      case this.keys.right:
        this.onRight();
        e.preventDefault();
        break;
      
      case this.keys.forward:
        this.onForward();
        break;
      
      case this.keys.reverse:
        this.onReverse();
        e.preventDefault();
        break;

      default:
        break;
    }
  }

  onKeyUp = (e) => {
    switch( e.keyCode ) {
      case this.keys.left:
      case this.keys.right:
        this.offSteer();
        e.preventDefault();
        break;
      
      case this.keys.forward:
      case this.keys.reverse:
        this.offGas();
        break;

      default:
        break;
    }
  }

  onForward() {
    const { maxVel, torque } = this.tuning;
    Object.values(this.wheels.R).forEach(({ constraint }) => {
      constraint.configureAngularMotor( 2, 1, 0, -maxVel, torque );
      constraint.enableAngularMotor( 2 );
    });
  }

  onReverse() {
    const { maxVel, torque } = this.tuning;
    Object.values(this.wheels.R).forEach(({ constraint }) => {
      constraint.configureAngularMotor( 2, 1, 0, maxVel, torque );
      constraint.enableAngularMotor( 2 );
    });
  }

  offGas() {
    Object.values(this.wheels.R).forEach(({ constraint }) => {
      constraint.disableAngularMotor( 2 );
    });
  }

  onLeft() {
    const { steerAngle } = this.tuning;
    Object.values(this.wheels.F).forEach(({ constraint }) => {
      constraint.setAngularLowerLimit({ x: 0, y: steerAngle, z: 1 });
      constraint.setAngularUpperLimit({ x: 0, y: steerAngle, z: 0 });
    });
  }

  onRight() {
    const { steerAngle } = this.tuning;
    Object.values(this.wheels.F).forEach(({ constraint }) => {
      constraint.setAngularLowerLimit({ x: 0, y: -steerAngle, z: 1 });
      constraint.setAngularUpperLimit({ x: 0, y: -steerAngle, z: 0 });
    });
  }

  offSteer() {
    Object.values(this.wheels.F).forEach(({ constraint }) => {
      constraint.setAngularLowerLimit({ x: 0, y: 0, z: 1 });
      constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
    });
  }
}

export default Vehicle;