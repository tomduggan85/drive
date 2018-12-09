
/* global THREE Physijs */

const DEFAULT_TUNING = {
  wheelBase: 16,
  trackWidth: 12,
  maxVel: 200,
  torque: 2000,
  chassisMass: 5000,
  wheelMass: 150,
  tireFriction: 3,
  steerAngle: Math.PI / 8,
}

class Vehicle {

  createChassis() {
    const { scene, tuning } = this;
    const chassisMaterial = Physijs.createMaterial(
      new THREE.MeshNormalMaterial(), 0.8, 0.2
    );
    //chassisMaterial.visible = false;

    const $chassis = new Physijs.BoxMesh(
      new THREE.BoxGeometry( this.tuning.trackWidth - 5, 4, tuning.wheelBase + 5 ),
      chassisMaterial,
      tuning.chassisMass
    );
    $chassis.position.y = 8;
    scene.add( $chassis );

    this.gltfLoader.load(
      'gltf/car/scene.gltf',
      ( carAsset ) => {
        $chassis.geometry.visible = false;
        carAsset.scene.scale.set(8, 8, 8)
        carAsset.scene.position.set(0, -3, 0);
        $chassis.add( carAsset.scene );
      },
      undefined,
      ( error ) => {
        console.error( error );
      }
    )

    this.$chassis = $chassis;
  }

  createWheel( isFront, isLeft ) {

    const x = this.tuning.trackWidth / 2 * (isLeft ? -1 : 1);
    const y = 6.5;
    const z = this.tuning.wheelBase / 2 * (isFront ? 1 : -1);

    if ( !this.wheelMaterial ) {
      this.wheelMaterial = Physijs.createMaterial(
        new THREE.MeshNormalMaterial(), this.tuning.tireFriction, 0.5
      );
    }
    
    if ( !this.wheelGeometry ) {
      this.wheelGeometry  = new THREE.CylinderGeometry( 2, 2, 1, 8 );
    }

    const $wheel = new Physijs.CylinderMesh( this.wheelGeometry, this.wheelMaterial, this.tuning.wheelMass );
    $wheel.rotation.z = Math.PI / 2;
    $wheel.position.set( x, y, z );
    
    this.scene.add( $wheel );
    const constraint = new Physijs.DOFConstraint(
      $wheel, this.$chassis, new THREE.Vector3( x, y, z )
    );
    this.scene.addConstraint( constraint );
    constraint.setAngularLowerLimit({ x: 1, y: 0, z: 0 });
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

    
    /*
    this.$chassis.position.y = 8;
    this.$chassis.__dirtyPosition = true;
    this.$chassis.__dirtyRotation = true;
    */

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
      constraint.configureAngularMotor( 0, 1, 0, maxVel, torque );
      constraint.enableAngularMotor( 0 );
    });
  }

  onReverse() {
    const { maxVel, torque } = this.tuning;
    Object.values(this.wheels.R).forEach(({ constraint }) => {
      constraint.configureAngularMotor( 0, 1, 0, -maxVel, torque );
      constraint.enableAngularMotor( 0 );
    });
  }

  offGas() {
    Object.values(this.wheels.R).forEach(({ constraint }) => {
      constraint.disableAngularMotor( 0 );
    });
  }

  onLeft() {
    const { steerAngle } = this.tuning;
    Object.values(this.wheels.F).forEach(({ constraint }) => {
      constraint.setAngularLowerLimit({ x: 1, y: steerAngle, z: 0 });
      constraint.setAngularUpperLimit({ x: 0, y: steerAngle, z: 0 });
    });
  }

  onRight() {
    const { steerAngle } = this.tuning;
    Object.values(this.wheels.F).forEach(({ constraint }) => {
      constraint.setAngularLowerLimit({ x: 1, y: -steerAngle, z: 0 });
      constraint.setAngularUpperLimit({ x: 0, y: -steerAngle, z: 0 });
    });
  }

  offSteer() {
    Object.values(this.wheels.F).forEach(({ constraint }) => {
      constraint.setAngularLowerLimit({ x: 1, y: 0, z: 0 });
      constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
    });
  }
}

export default Vehicle;