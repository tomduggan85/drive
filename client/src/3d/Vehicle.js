
/* global THREE Physijs */

import { VEHICLE_DEFS } from '../shared/Vehicles'

const SHOW_DEBUG_COLLISION_VOLUMES = false;

const CHASSIS_FRICTION = 0.8;
const CHASSIS_RESTITUTION = 0.4;

export class Vehicle {

  constructor( props ) {
    this.vehicleType = props.vehicleType;
    this.$scene = props.$scene;
    this.vehicleDef = VEHICLE_DEFS[ props.vehicleType ];
    this.keys = props.keys;
    this.loader = new THREE.GLTFLoader();

    this.createChassis();

    /*
      TODO: Change shape of this.wheels to allow for front-wheel-drive cars (where two of the
      wheels both steer and drive, and two wheels have no powered function)
    */
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
      TODO: Move all scene objects ($chassis and wheels) by one single transformation matrix
      and mark all as dirty, to properly set starting position with no object jumps / glitches.
    */
    this.$chassis.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z);
    this.$chassis.position.set(props.position.x, props.position.y, props.position.z);
    this.$chassis.__dirtyPosition = true;
    this.$chassis.__dirtyRotation = true;
    
    document.addEventListener( 'keydown', this.onKeyDown );
    document.addEventListener( 'keyup', this.onKeyUp );
  }

  createChassis() {
    const { $scene, vehicleDef } = this;
    
    const chassisMaterial = Physijs.createMaterial(
      new THREE.MeshNormalMaterial(), CHASSIS_FRICTION, CHASSIS_RESTITUTION
    );
    chassisMaterial.visible = SHOW_DEBUG_COLLISION_VOLUMES;

    /*
      The first shape in the chassisShapes is assumed to be the "main" shape, and gets all of the chassis mass.
      Each additional shape is given an arbitrary small mass, as they are usually the higher shapes
      and I want to keep the center of gravity low, for stability and realism.
    */

    const { size, offset } = vehicleDef.chassisShapes[0];
    this.$chassis = new Physijs.BoxMesh(
      new THREE.BoxGeometry( size.x, size.y, size.z ),
      chassisMaterial,
      vehicleDef.chassisMass
    );
    this.$chassis.position.set( offset.x, offset.y, offset.z )
    
    for ( let i = 1; i < vehicleDef.chassisShapes.length; i++ ) {
      const someSmallMass = 50;
      const { size, offset } = vehicleDef.chassisShapes[i];

      const $shape = new Physijs.BoxMesh(
        new THREE.BoxGeometry( size.x, size.y, size.z ),
        chassisMaterial,
        someSmallMass
      );
      $shape.position.set( offset.x, offset.y, offset.z )

      this.$chassis.add($shape);
    }

    //Main chassis must be added to the scene *after* additional objects have been added to it, for PhysiJS to create the compound collision shape.
    $scene.add( this.$chassis );
    this.loadChassisAsset();
  }

  loadChassisAsset() {
    const { chassisAsset: { uri, scale, position, rotation } } = this.vehicleDef;
    const { $chassis } = this;

    this.loader.load(
      uri,
      ( { scene: asset } ) => {
        asset.scale.set(scale, scale, scale)
        asset.position.set( position.x, position.y, position.z );
        asset.rotation.set( rotation.x, rotation.y, rotation.z )
        $chassis.add( asset );
      },
      undefined, //onProgress
      ( error ) => {
        console.error( error, `Error loading chassis asset: ${ uri }` );
      }
    );
  }

  createWheelMaterialAndGeometry() {
    if ( !this.wheelMaterial ) {
      this.wheelMaterial = Physijs.createMaterial(
        new THREE.MeshNormalMaterial(), this.vehicleDef.tireFriction, 0.5
      );
      this.wheelMaterial.visible = SHOW_DEBUG_COLLISION_VOLUMES;
    }
    
    if ( !this.wheelGeometry ) {
      this.wheelGeometry  = new THREE.CylinderGeometry( this.vehicleDef.wheelDiameter, this.vehicleDef.wheelDiameter, this.vehicleDef.wheelWidth, 50 );
    }
  }

  createWheel( isFront, isLeft ) {

    const x = this.vehicleDef.wheelBase / 2 * (isFront ? 1 : -1);
    const y = this.vehicleDef.rideHeight;
    const z = this.vehicleDef.trackWidth / 2 * (isLeft ? -1 : 1);

    this.createWheelMaterialAndGeometry();

    const $wheel = new Physijs.CylinderMesh( this.wheelGeometry, this.wheelMaterial, this.vehicleDef.wheelMass );
    
    $wheel.rotation.x = Math.PI / 2;

    $wheel.position.set( x, y, z );
    
    this.$scene.add( $wheel );

    let constraint;
    if (isFront) {
      constraint = new Physijs.DOFConstraint(
        $wheel, this.$chassis, new THREE.Vector3( x, y, z )
      );
      this.$scene.addConstraint( constraint, { disableCollision: true } );
      constraint.setAngularLowerLimit({ x: 0, y: 0, z: isFront ? 1 : 0 });
      constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 }); 
    }
    else {
      constraint = new Physijs.HingeConstraint(
        $wheel,
        this.$chassis,
        new THREE.Vector3( x, y, z ),
        new THREE.Vector3( 0, 1, 0 ),
        new THREE.Vector3( 0, 0, 1 )
      );
      this.$scene.addConstraint( constraint, { disableCollision: true } );
    }

    this.loadWheelAsset( $wheel, isFront, isLeft );
    
    return { $wheel, constraint }
  }

  loadWheelAsset( $wheel, isFront, isLeft ) {
    const { wheelAsset: { uri, scale, position, rotation, flip } } = this.vehicleDef;

    this.loader.load(
      uri,
      ( { scene: asset } ) => {
        asset.scale.set(scale, scale, scale);

        /*
          Different wheel assets need to be mirrored on different axes in order to face the correct direction
          so vehicleDef.wheelAsset.flip is 'x', 'y' or 'z'
        */

        if ( !isLeft ) {
          asset.scale[ flip ] *= -1;
        }
        asset.position.set( position.x, position.y, position.z );
        asset.rotation.set( rotation.x, rotation.y, rotation.z )
        $wheel.add( asset );
      },
      undefined, //onProgress
      ( error ) => {
        console.error( error, `Error wheel chassis asset: ${ uri }` );
      }
    );
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
    const { maxVel, torque } = this.vehicleDef;
    Object.values(this.wheels.R).forEach(({ constraint }) => {
      //constraint.configureAngularMotor( 2, 1, 0, -maxVel, torque );
      //constraint.enableAngularMotor( 2 );
      constraint.enableAngularMotor( -maxVel, torque );
    });
  }

  onReverse() {
    const { maxVel, torque } = this.vehicleDef;
    Object.values(this.wheels.R).forEach(({ constraint }) => {
      //constraint.configureAngularMotor( 2, 1, 0, maxVel, torque );
      //constraint.enableAngularMotor( 2 );
      constraint.enableAngularMotor( maxVel, torque );
    });
  }

  offGas() {
    Object.values(this.wheels.R).forEach(({ constraint }) => {
      //constraint.disableAngularMotor( 2 );
      constraint.disableMotor();
    });
  }

  onLeft() {
    const { steerAngle } = this.vehicleDef;
    Object.values(this.wheels.F).forEach(({ constraint }) => {
      constraint.setAngularLowerLimit({ x: 0, y: steerAngle, z: 1 });
      constraint.setAngularUpperLimit({ x: 0, y: steerAngle, z: 0 });
    });
  }

  onRight() {
    const { steerAngle } = this.vehicleDef;
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
